import { useState } from 'react';
import { useBuildingStore } from '../store/buildingStore';
import { HexColorPicker } from 'react-colorful';
import catalogData from '../data/building-catalog.json';
import type { BuildingCatalog, CategoryKey } from '../types/catalog';

const catalog = catalogData as BuildingCatalog;

export const ControlPanel = () => {
  const {
    width,
    depth,
    wallHeight,
    selectedCategory,
    selectedBuildingId,
    hasLoft,
    porchType,
    hasGarageDoor,
    hasMetalRoof,
    hasDormer,
    doors,
    windows,
    doorWidth,
    wallColor,
    roofColor,
    trimColor,
    doorColor,
    totalPrice,
    getSelectedBuilding,
    getAvailableSizes,
    setWallHeight,
    setCategory,
    setBuildingType,
    setSize,
    setHasLoft,
    setPorchType,
    setHasGarageDoor,
    setHasMetalRoof,
    setHasDormer,
    setDoors,
    setWindows,
    setDoorWidth,
    setWallColor,
    setRoofColor,
    setTrimColor,
    setDoorColor,
    resetConfig,
  } = useBuildingStore();

  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  const selectedBuilding = getSelectedBuilding();
  const availableSizes = getAvailableSizes();
  const currentSize = `${width}x${depth}`;

  const categories: { key: CategoryKey; label: string }[] = [
    { key: 'gambrel', label: 'Gambrel Roof' },
    { key: 'gable', label: 'Gable Roof' },
    { key: 'lean-to', label: 'Lean-To' },
    { key: 'economy', label: 'Economy' },
  ];

  const currentCategory = catalog.buildingCategories[selectedCategory];
  const buildings = currentCategory?.buildings || [];

  const porchTypes: { value: 'none' | 'side' | 'corner' | 'wraparound'; label: string }[] = [
    { value: 'none', label: 'No Porch' },
    { value: 'side', label: 'Side Porch (+$1,200)' },
    { value: 'corner', label: 'Corner Porch (+$1,800)' },
    { value: 'wraparound', label: 'Wraparound (+$2,800)' },
  ];

  const ColorButton = ({
    label,
    color,
    onChange,
    pickerId,
  }: {
    label: string;
    color: string;
    onChange: (color: string) => void;
    pickerId: string;
  }) => (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1 text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            setActiveColorPicker(activeColorPicker === pickerId ? null : pickerId)
          }
          className="w-16 h-10 rounded border-2 border-gray-300 shadow-sm hover:border-blue-500 transition-colors"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm text-gray-600 font-mono">{color.toUpperCase()}</span>
      </div>
      {activeColorPicker === pickerId && (
        <div className="mt-2">
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white p-6 overflow-y-auto h-full shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Building Designer</h2>
        <p className="text-sm text-gray-600">
          Powered by Graceland Portable Buildings catalog
        </p>
      </div>

      {/* Price Display */}
      <div className="bg-blue-600 text-white p-4 rounded-lg mb-6 shadow-md">
        <div className="text-sm font-medium mb-1">Estimated Price</div>
        <div className="text-3xl font-bold">${totalPrice.toLocaleString()}</div>
        <div className="text-xs mt-1 opacity-90">
          {width} × {depth} ft = {width * depth} sq ft
        </div>
      </div>

      {/* Roof Style / Category Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">
          1. Select Roof Style
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat.key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {currentCategory?.description}
        </p>
      </div>

      {/* Building Type Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">
          2. Select Building Type
        </h3>
        <div className="space-y-2">
          {buildings.map((building) => (
            <button
              key={building.id}
              onClick={() => setBuildingType(building.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${
                selectedBuildingId === building.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="font-medium">{building.name}</div>
              <div className={`text-xs mt-1 ${
                selectedBuildingId === building.id ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {building.sizes.length} sizes available
              </div>
            </button>
          ))}
        </div>
        {selectedBuilding && (
          <div className="mt-3 p-3 bg-gray-50 rounded text-xs text-gray-700">
            <div className="font-medium mb-1">{selectedBuilding.name}</div>
            <div>{selectedBuilding.description}</div>
          </div>
        )}
      </div>

      {/* Size Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">
          3. Select Size
        </h3>
        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
          {availableSizes.map((sizeStr) => (
            <button
              key={sizeStr}
              onClick={() => setSize(sizeStr)}
              className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                currentSize === sizeStr
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {sizeStr}
            </button>
          ))}
        </div>
        <div className="mt-3 text-sm text-gray-600">
          Current: <strong>{width} × {depth} ft</strong> ({width * depth} sq ft)
        </div>
      </div>

      {/* Wall Height */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">
          Wall Height
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Height: {wallHeight} ft
          </label>
          <input
            type="range"
            min="6"
            max="12"
            step="1"
            value={wallHeight}
            onChange={(e) => setWallHeight(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Optional Features */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">
          4. Optional Features
        </h3>

        {/* Loft */}
        {(selectedCategory === 'gambrel' || selectedCategory === 'gable') && (
          <label className="flex items-center justify-between mb-3 p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
            <div>
              <div className="font-medium text-sm">Add Loft Storage</div>
              <div className="text-xs text-gray-600">+$800 for overhead storage</div>
            </div>
            <input
              type="checkbox"
              checked={hasLoft}
              onChange={(e) => setHasLoft(e.target.checked)}
              className="w-5 h-5"
            />
          </label>
        )}

        {/* Porch */}
        {selectedBuildingId.includes('cabin') && (
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Porch Type
            </label>
            <select
              value={porchType}
              onChange={(e) => setPorchType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {porchTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Garage Door */}
        {(selectedBuildingId.includes('garage') || selectedCategory === 'gable') && (
          <label className="flex items-center justify-between mb-3 p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
            <div>
              <div className="font-medium text-sm">Garage Door</div>
              <div className="text-xs text-gray-600">+$600 upgrade</div>
            </div>
            <input
              type="checkbox"
              checked={hasGarageDoor}
              onChange={(e) => setHasGarageDoor(e.target.checked)}
              className="w-5 h-5"
            />
          </label>
        )}

        {/* Metal Roof */}
        <label className="flex items-center justify-between mb-3 p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
          <div>
            <div className="font-medium text-sm">Metal Roofing</div>
            <div className="text-xs text-gray-600">+${(width * depth * 3).toLocaleString()} premium upgrade</div>
          </div>
          <input
            type="checkbox"
            checked={hasMetalRoof}
            onChange={(e) => setHasMetalRoof(e.target.checked)}
            className="w-5 h-5"
          />
        </label>

        {/* Dormer */}
        {selectedCategory === 'gable' && (
          <label className="flex items-center justify-between mb-3 p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
            <div>
              <div className="font-medium text-sm">Dormer Window</div>
              <div className="text-xs text-gray-600">+$900 for added light & headroom</div>
            </div>
            <input
              type="checkbox"
              checked={hasDormer}
              onChange={(e) => setHasDormer(e.target.checked)}
              className="w-5 h-5"
            />
          </label>
        )}
      </div>

      {/* Doors & Windows */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">
          Doors & Windows
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Number of Doors: {doors}
          </label>
          <input
            type="range"
            min="1"
            max="3"
            step="1"
            value={doors}
            onChange={(e) => setDoors(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Door Width: {doorWidth} ft
          </label>
          <input
            type="range"
            min="3"
            max="8"
            step="1"
            value={doorWidth}
            onChange={(e) => setDoorWidth(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Number of Windows: {windows}
          </label>
          <input
            type="range"
            min="0"
            max="6"
            step="1"
            value={windows}
            onChange={(e) => setWindows(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Colors */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">
          Colors
        </h3>

        <ColorButton
          label="Wall Color"
          color={wallColor}
          onChange={setWallColor}
          pickerId="wall"
        />
        <ColorButton
          label="Roof Color"
          color={roofColor}
          onChange={setRoofColor}
          pickerId="roof"
        />
        <ColorButton
          label="Trim Color"
          color={trimColor}
          onChange={setTrimColor}
          pickerId="trim"
        />
        <ColorButton
          label="Door Color"
          color={doorColor}
          onChange={setDoorColor}
          pickerId="door"
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4 border-t">
        <button
          onClick={() => setShowQuoteForm(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors"
        >
          Get a Quote
        </button>

        <button
          onClick={resetConfig}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Reset Configuration
        </button>
      </div>

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Request a Quote</h3>
            <QuoteForm
              totalPrice={totalPrice}
              onClose={() => setShowQuoteForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const QuoteForm = ({
  totalPrice,
  onClose,
}: {
  totalPrice: number;
  onClose: () => void;
}) => {
  const config = useBuildingStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    zipCode: config.zipCode,
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:3001/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          buildingConfig: {
            width: config.width,
            depth: config.depth,
            wallHeight: config.wallHeight,
            selectedCategory: config.selectedCategory,
            selectedBuildingId: config.selectedBuildingId,
            hasLoft: config.hasLoft,
            hasPorch: config.hasPorch,
            porchType: config.porchType,
            hasGarageDoor: config.hasGarageDoor,
            hasMetalRoof: config.hasMetalRoof,
            hasDormer: config.hasDormer,
            doors: config.doors,
            windows: config.windows,
            doorWidth: config.doorWidth,
            wallColor: config.wallColor,
            roofColor: config.roofColor,
            trimColor: config.trimColor,
            doorColor: config.doorColor,
          },
          totalPrice,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Failed to submit quote request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert('Failed to submit quote request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">✓</div>
        <h4 className="text-xl font-bold mb-2 text-green-600">Quote Submitted!</h4>
        <p className="text-gray-600 mb-6">
          We'll contact you shortly with more information about your building.
        </p>
        <button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone *</label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Zip Code *</label>
        <input
          type="text"
          required
          value={formData.zipCode}
          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Additional Notes</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="bg-gray-50 p-3 rounded">
        <div className="text-sm text-gray-600 mb-1">Estimated Price:</div>
        <div className="text-2xl font-bold text-blue-600">
          ${totalPrice.toLocaleString()}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Quote'}
        </button>
      </div>
    </form>
  );
};
