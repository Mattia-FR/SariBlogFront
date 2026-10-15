import ErrorView from "../../molecules/ErrorView";

function UnauthorizedPage() {
  return <ErrorView status={403} />;
}

export default UnauthorizedPage;
