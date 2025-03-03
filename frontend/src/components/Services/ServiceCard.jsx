// C:\Users\Youcode\Desktop\Factura\frontend\src\components\Services\ServiceCard.jsx
export default function ServiceCard({ service }) {
    const { id, logo, name, description } = service;
    
    return (
      <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="w-24 h-24 flex items-center justify-center mb-3 bg-white rounded-md">
          <img 
            src={logo} 
            alt={name} 
            className="max-h-16 max-w-16 object-contain" 
          />
        </div>
        <h3 className="text-sm font-medium text-gray-800 text-center">{name}</h3>
        <p className="text-xs text-gray-500 text-center mt-1">{description}</p>
      </div>
    );
  }