import Image from "next/image";
import messageCircle from '../components/assets/message-circle.svg';

export default function Header() {
  return (
    <header className="flex justify-between mb-5">
      {/* Title and subtitle */}
      <div>
        <div className="text-primary text-2xl leading-8">Developer</div>
        <div className="text-sm leading-5 text-secondary-text">Project 3</div>
      </div>
      {/* Button */}
      <button className="text-primary border p-3.5 rounded-lg bg-white shadow-default-shadow border-[
#d0d5dd] text-xs placeholder:secondary-text placeholder:text-[14px]">
        <Image src={messageCircle} width={20} height={20} alt="Message icon" />
      </button>
    </header>
  );
}
