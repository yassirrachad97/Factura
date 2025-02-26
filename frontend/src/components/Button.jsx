export default function Button({ text, onClick, type = 'button' }) {
    return (
      <button
        type={type}
        onClick={onClick}
        className="w-full p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
      >
        {text}
      </button>
    );
  }
  