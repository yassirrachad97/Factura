import InputField from '../Common/InputField';
import Button from '../Common/Button';
import PasswordField from '../Common/PasswordField';

export default function AuthForm({ fields, onSubmit, buttonText }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {fields.map((field, index) => (
        field.type === 'password' ? (
          <PasswordField
            key={index}
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            placeholder={field.placeholder}
            showPassword={field.showPassword}
            setShowPassword={field.setShowPassword}
          />
        ) : (
          <InputField
            key={index}
            type={field.type}
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            placeholder={field.placeholder}
          />
        )
      ))}
      <Button text={buttonText} type="submit" />
    </form>
  );
}