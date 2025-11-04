import { useState } from 'react';
import { useBuildingStore, BuildingStyle, RoofStyle } from '../store/buildingStore';
import { HexColorPicker } from 'react-colorful';

export const ControlPanel = () => {
  const {
    width,
    depth,
    wallHeight,
    buildingStyle,
    roofStyle,
    doors,
    windows,
    doorWidth,
    wallColor,
    roofColor,
    trimColor,
    doorColor,
    totalPrice,
    setWidth,
    setDepth,
    setWallHeight,
    setBuildingStyle,
    setRoofStyle,
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

  const buildingStyles: { value: BuildingStyle; label: string }[] = [
    { value: 'lofted-barn', label: 'Lofted Barn' },
    { value: 'utility', label: 'Utility Shed' },
    { value: 'cottage', label: 'Cottage' },
    { value: 'cabin', label: 'Cabin' },
  ];

  const roofStyles: { value: RoofStyle; label: string }[] = [
    { value: 'gambrel', label: 'Gambrel' },
    { value: 'gable', label: 'Gable' },
    { value: 'a-frame', label: 'A-Frame' },
    { value: 'barn', label: 'Barn' },
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
        <p className="text-sm text-gray-600">Customize your portable building</p>
      </div>

      {/* Price Display */}
      <div className="bg-blue-600 text-white p-4 rounded-lg mb-6 shadow-md">
        <div className="text-sm font-medium mb-1">Estimated Price</div>
        <div className="text-3xl font-bold">${totalPrice.toLocaleString()}</div>
        <div className="text-xs mt-1 opacity-90">Price may vary by location</div>
      </div>

      {/* Dimensions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">
          Dimensions
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Width: {width} ft
          </label>
          <input
            type="range"
            min="8"
            max="16"
            step="2"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Depth: {depth} ft
          </label>
          <input
            type="range"
            min="8"
            max="24"
            step="2"
            value={depth}
            onChange={(e) => setDepth(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Wall Height: {wallHeight} ft
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

      {/* Style Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">
          Building Style
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {buildingStyles.map((style) => (
            <button
              key={style.value}
              onClick={() => setBuildingStyle(style.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                buildingStyle === style.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Roof Style */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">
          Roof Style
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {roofStyles.map((style) => (
            <button
              key={style.value}
              onClick={() => setRoofStyle(style.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                roofStyle === style.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
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
            buildingStyle: config.buildingStyle,
            roofStyle: config.roofStyle,
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
