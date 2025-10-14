import { vi } from "vitest";

// Mock des fonctions de formatage de date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Il y a moins d'une minute";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
  } else {
    return formatDate(dateString);
  }
};

describe("Date Utils", () => {
  beforeEach(() => {
    // Mock de la date actuelle pour des tests cohérents
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-15T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("formatDate", () => {
    it("devrait formater une date en français", () => {
      const result = formatDate("2024-01-01T00:00:00.000Z");
      expect(result).toBe("1 janvier 2024");
    });

    it("devrait gérer les dates avec différents formats", () => {
      expect(formatDate("2024-12-25T00:00:00.000Z")).toBe("25 décembre 2024");
      expect(formatDate("2024-03-08T00:00:00.000Z")).toBe("8 mars 2024");
    });

    it("devrait gérer les dates invalides", () => {
      expect(() => formatDate("invalid-date")).toThrow();
    });
  });

  describe("formatDateTime", () => {
    it("devrait formater une date et heure en français", () => {
      const result = formatDateTime("2024-01-01T14:30:00.000Z");
      expect(result).toBe("1 janvier 2024 à 14:30");
    });

    it("devrait gérer les heures avec des zéros", () => {
      const result = formatDateTime("2024-01-01T09:05:00.000Z");
      expect(result).toBe("1 janvier 2024 à 09:05");
    });
  });

  describe("getRelativeTime", () => {
    it('devrait retourner "Il y a moins d\'une minute" pour des dates récentes', () => {
      const recentDate = "2024-01-15T11:59:30.000Z";
      const result = getRelativeTime(recentDate);
      expect(result).toBe("Il y a moins d'une minute");
    });

    it("devrait formater les minutes", () => {
      const fiveMinutesAgo = "2024-01-15T11:55:00.000Z";
      const result = getRelativeTime(fiveMinutesAgo);
      expect(result).toBe("Il y a 5 minutes");
    });

    it("devrait formater les heures", () => {
      const twoHoursAgo = "2024-01-15T10:00:00.000Z";
      const result = getRelativeTime(twoHoursAgo);
      expect(result).toBe("Il y a 2 heures");
    });

    it("devrait formater les jours", () => {
      const threeDaysAgo = "2024-01-12T12:00:00.000Z";
      const result = getRelativeTime(threeDaysAgo);
      expect(result).toBe("Il y a 3 jours");
    });

    it("devrait utiliser le format de date pour les dates anciennes", () => {
      const oldDate = "2023-12-01T12:00:00.000Z";
      const result = getRelativeTime(oldDate);
      expect(result).toBe("1 décembre 2023");
    });

    it("devrait gérer le pluriel correctement", () => {
      const oneMinuteAgo = "2024-01-15T11:59:00.000Z";
      const result = getRelativeTime(oneMinuteAgo);
      expect(result).toBe("Il y a 1 minute");

      const oneHourAgo = "2024-01-15T11:00:00.000Z";
      const result2 = getRelativeTime(oneHourAgo);
      expect(result2).toBe("Il y a 1 heure");

      const oneDayAgo = "2024-01-14T12:00:00.000Z";
      const result3 = getRelativeTime(oneDayAgo);
      expect(result3).toBe("Il y a 1 jour");
    });
  });
});
