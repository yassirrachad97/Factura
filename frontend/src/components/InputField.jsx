export default function InputField({ label, type, name, value, onChange }) {
    return (
      <div>
        <label className="block font-medium">{label}</label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-2 border rounded-xl mt-1"
          required
        />
      </div>
    );
  }
  