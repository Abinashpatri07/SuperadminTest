// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import VerificationPage from "./pages/candidate/VerificationPage";
// import LoginPage from "./pages/candidate/LoginPage";
// import ForgotPassword from "./components/candidate/login/ForgotPassword";
// import DigiLockerPage from "./components/candidate/digilocker/DigiLockerPage";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LoginPage/>} />
//         <Route path="/verification" element={<VerificationPage />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/digilocker" element={<DigiLockerPage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import AppRoutes from "./routes/AppRoutes";

function App() {
  return <AppRoutes />;
}

export default App;

// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import AdminRoutes from "./routes/AdminRoutes";
// import LoginPage from "./pages/candidate/LoginPage"; // candidate

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* Candidate */}
//         <Route path="/" element={<LoginPage />} />

//         {/* Admin */}
//         <Route path="/admin/*" element={<AdminRoutes />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;