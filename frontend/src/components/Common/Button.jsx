export default function Button({ text, onClick, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full p-3 bg-[#2e3f6e] text-white rounded-md hover:bg-[#1e2f5e] transition-colors"
    >
      {text}
    </button>
  );
}