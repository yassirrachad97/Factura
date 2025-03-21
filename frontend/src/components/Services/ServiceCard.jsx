export default function ServiceCard({ service }) {
  const { logo, name, description } = service;
  
  return (
    <div className="group flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-100 h-64 w-full max-w-xs">
      <div className="w-24 h-24 flex items-center justify-center mb-4 bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors duration-300">
        <img 
          src={logo} 
          alt={name} 
          className="max-h-16 max-w-16 object-contain" 
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 text-center">{name}</h3>
      <div className="w-12 h-1 bg-blue-500 my-3 rounded-full group-hover:w-16 transition-all duration-300"></div>
      <p className="text-sm text-gray-600 text-center mt-1 leading-relaxed line-clamp-2 overflow-hidden">
        {description}
      </p>
    </div>
  );
}