// C:\Users\Youcode\Desktop\Factura\frontend\src\components\Dashboard\CategoryHeader.jsx
export default function CategoryHeader({ title }) {
    return (
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2e3f6e]">{title}</h1>
        <div className="mt-2 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Sélectionnez un fournisseur pour effectuer une opération
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un service..."
              className="pl-9 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2e3f6e] focus:border-transparent"
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>
      </div>
    );
  }