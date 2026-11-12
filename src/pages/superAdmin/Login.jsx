import LoginForm from "../../components/superAdmin/login/LoginForm";
import PromoCard from "../../components/superAdmin/login/PromoCard";

function Login() {

  return (

    <div className="min-h-screen grid md:grid-cols-2">
    
          {/* Left Side */}
          <div className="relative bg-[#EEF0F8] flex items-center justify-center overflow-hidden">
    
            {/* Top-right circle (outline only, partially cut off) */}
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border-28 border-[#C8CCEB]" />
    
            {/* Bottom-left organic blob */}
            <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[#C8CCEB] rounded-[60%_40%_40%_60%/40%_40%_60%_60%]" />
    
            <LoginForm />
          </div>
    
          {/* Right Side */}
          <PromoCard />
        </div>
  );
}

export default Login;