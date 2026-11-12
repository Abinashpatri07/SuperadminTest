import clientlogo from "../../../assets/clientlogo.png";
import bgPattern from "../../../assets/promocard.png";

export default function PromoCard() {
  return (
    <div
      className="hidden md:flex relative min-h-screen bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${bgPattern})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#08112E]/75"></div>

      {/* Card wrapper position */}
      <div className="relative z-10 w-full flex items-center justify-center px-10">
        <div className="relative w-78.75 h-101.25 rounded-[30px] border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl overflow-hidden">

          
          <div className="absolute top-7 left-7 z-20">
            <h2 className="text-white text-[22px] font-bold leading-[1.35] tracking-tight">
              Your Next <br />
              Big Chapter <br />
              Starts Here.
            </h2>
          </div>

          
          <img
            src={clientlogo}
            alt="clientlogo"
            className="absolute bottom-0 -right-2 w-63.75 max-w-none"
          />
        </div>
      </div>
    </div>
  );
}