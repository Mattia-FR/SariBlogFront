import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import AdminArticleForm from "../../../components/molecules/AdminArticleForm";
import { useAdminUpload } from "../../../hooks/useAdminUpload";
import { mockFormData, mockTag } from "../../utils/test-utils";

// Mock du hook useAdminUpload
vi.mock("../../../hooks/useAdminUpload");

const mockUseAdminUpload = useAdminUpload as any;

describe("AdminArticleForm", () => {
  const mockTags = [mockTag, { ...mockTag, id: 2, name: "Tag 2" }];
  const mockSetFormData = vi.fn();
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  const defaultProps = {
    formData: mockFormData,
    setFormData: mockSetFormData,
    tags: mockTags,
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    isEditing: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAdminUpload.mockReturnValue({
      uploadSingle: vi.fn(),
    });
  });

  it("devrait rendre le formulaire avec tous les champs", () => {
    render(<AdminArticleForm {...defaultProps} />);

    expect(screen.getByLabelText(/titre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/extrait/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contenu/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/image/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/statut/i)).toBeInTheDocument();
    expect(screen.getByText(/tags/i)).toBeInTheDocument();
  });

  it("devrait afficher les valeurs du formulaire", () => {
    render(<AdminArticleForm {...defaultProps} />);

    expect(screen.getByDisplayValue(mockFormData.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockFormData.excerpt)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockFormData.content)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockFormData.status)).toBeInTheDocument();
  });

  it("devrait mettre à jour les données du formulaire lors de la saisie", async () => {
    const user = userEvent.setup();
    render(<AdminArticleForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/titre/i);
    await user.clear(titleInput);
    await user.type(titleInput, "Nouveau titre");

    expect(mockSetFormData).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Nouveau titre",
      }),
    );
  });

  it("devrait gérer la sélection des tags", async () => {
    const user = userEvent.setup();
    render(<AdminArticleForm {...defaultProps} />);

    const tagCheckbox = screen.getByLabelText(mockTag.name);
    await user.click(tagCheckbox);

    expect(mockSetFormData).toHaveBeenCalledWith(
      expect.objectContaining({
        tagIds: expect.arrayContaining([mockTag.id]),
      }),
    );
  });

  it("devrait gérer l'upload d'image", async () => {
    const mockUploadSingle = vi.fn().mockResolvedValue({
      file: { filename: "new-image.jpg" },
    });
    mockUseAdminUpload.mockReturnValue({
      uploadSingle: mockUploadSingle,
    });

    const user = userEvent.setup();
    render(<AdminArticleForm {...defaultProps} />);

    const fileInput = screen.getByLabelText(/image/i);
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

    await user.upload(fileInput, file);

    expect(mockUploadSingle).toHaveBeenCalledWith(file);

    await waitFor(() => {
      expect(mockSetFormData).toHaveBeenCalledWith(
        expect.objectContaining({
          image: "new-image.jpg",
        }),
      );
    });
  });

  it("devrait afficher l'état d'upload en cours", async () => {
    const mockUploadSingle = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );
    mockUseAdminUpload.mockReturnValue({
      uploadSingle: mockUploadSingle,
    });

    const user = userEvent.setup();
    render(<AdminArticleForm {...defaultProps} />);

    const fileInput = screen.getByLabelText(/image/i);
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

    await user.upload(fileInput, file);

    expect(screen.getByText("Upload en cours...")).toBeInTheDocument();
    expect(fileInput).toBeDisabled();
  });

  it("devrait afficher le nom du fichier uploadé", () => {
    const propsWithImage = {
      ...defaultProps,
      formData: { ...mockFormData, image: "uploaded-image.jpg" },
    };

    render(<AdminArticleForm {...propsWithImage} />);

    expect(
      screen.getByText("Image sélectionnée: uploaded-image.jpg"),
    ).toBeInTheDocument();
  });

  it("devrait soumettre le formulaire", async () => {
    const user = userEvent.setup();
    render(<AdminArticleForm {...defaultProps} />);

    const submitButton = screen.getByRole("button", {
      name: /créer l'article/i,
    });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("devrait annuler le formulaire", async () => {
    const user = userEvent.setup();
    render(<AdminArticleForm {...defaultProps} />);

    const cancelButton = screen.getByRole("button", { name: /annuler/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("devrait afficher le bon texte pour le mode édition", () => {
    const editingProps = { ...defaultProps, isEditing: true };
    render(<AdminArticleForm {...editingProps} />);

    expect(
      screen.getByRole("button", { name: /modifier l'article/i }),
    ).toBeInTheDocument();
  });

  it("devrait afficher le bon texte pour le mode création", () => {
    render(<AdminArticleForm {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: /créer l'article/i }),
    ).toBeInTheDocument();
  });

  it("devrait valider les champs requis", async () => {
    const user = userEvent.setup();
    render(<AdminArticleForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/titre/i);
    const contentInput = screen.getByLabelText(/contenu/i);

    // Vider les champs requis
    await user.clear(titleInput);
    await user.clear(contentInput);

    const submitButton = screen.getByRole("button", {
      name: /créer l'article/i,
    });
    await user.click(submitButton);

    // Les champs requis devraient être marqués comme invalides
    expect(titleInput).toBeInvalid();
    expect(contentInput).toBeInvalid();
  });

  it("devrait gérer les erreurs d'upload", async () => {
    const mockUploadSingle = vi
      .fn()
      .mockRejectedValue(new Error("Upload failed"));
    mockUseAdminUpload.mockReturnValue({
      uploadSingle: mockUploadSingle,
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const user = userEvent.setup();
    render(<AdminArticleForm {...defaultProps} />);

    const fileInput = screen.getByLabelText(/image/i);
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur upload:",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });

  it("devrait afficher tous les tags disponibles", () => {
    render(<AdminArticleForm {...defaultProps} />);

    mockTags.forEach((tag) => {
      expect(screen.getByLabelText(tag.name)).toBeInTheDocument();
    });
  });

  it("devrait pré-sélectionner les tags dans le formulaire", () => {
    const propsWithSelectedTags = {
      ...defaultProps,
      formData: { ...mockFormData, tagIds: [1, 2] },
    };

    render(<AdminArticleForm {...propsWithSelectedTags} />);

    mockTags.forEach((tag) => {
      const checkbox = screen.getByLabelText(tag.name);
      expect(checkbox).toBeChecked();
    });
  });
});
