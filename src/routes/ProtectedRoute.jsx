function ProtectedRoute({ children }) {
  // Direct access for testing: bypass login authentication checks
  return children;
}

export default ProtectedRoute;
