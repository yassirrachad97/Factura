import Footer from '../Common/Footer';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex max-w-5xl w-full bg-white rounded-lg shadow-md overflow-hidden">
      
        <div className="hidden md:block w-1/2 bg-gray-900 relative">
          <img 
            src="/src/assets/login-image.jpg" 
            alt="Bureau avec café et notes" 
            className="w-full h-full object-cover opacity-90"
          />
        </div>

       
        <div className="w-full md:w-1/2 p-8">
          {children}
          <Footer />
        </div>
      </div>
    </div>
  );
}