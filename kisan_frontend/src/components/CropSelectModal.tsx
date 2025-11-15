import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const ADDITIONAL_CROPS = [
  'Arhar (Tur/Red Gram)',
  'Banana',
  'Barley',
  'Black Gram (Urad)',
  'Cashew',
  'Chana (Chickpea)',
  'Coconut',
  'Coffee',
  'Coriander',
  'Cumin',
  'Garlic',
  'Ginger',
  'Gram (Bengal Gram)',
  'Green Gram (Moong)',
  'Groundnut',
  'Jowar (Sorghum)',
  'Lentil (Masoor)',
  'Mango',
  'Mustard',
  'Papaya',
  'Pearl Millet (Bajra)',
  'Pepper',
  'Ragi (Finger Millet)',
  'Safflower',
  'Sesame',
  'Soybean',
  'Sunflower',
  'Tea',
  'Turmeric',
];

interface CropSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCrops: string[];
  onCropsChange: (crops: string[]) => void;
}

export function CropSelectModal({ isOpen, onClose, selectedCrops, onCropsChange }: CropSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [customCrop, setCustomCrop] = useState('');

  const filteredCrops = ADDITIONAL_CROPS.filter(crop =>
    crop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      onCropsChange(selectedCrops.filter(c => c !== crop));
    } else {
      onCropsChange([...selectedCrops, crop]);
    }
  };

  const handleAddCustom = () => {
    if (customCrop.trim() && !selectedCrops.includes(customCrop.trim())) {
      onCropsChange([...selectedCrops, customCrop.trim()]);
      setCustomCrop('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Additional Crops</DialogTitle>
          <DialogDescription>
            Choose from the list or add your own crop
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search crops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Crop List */}
          <ScrollArea className="flex-1 pr-4 min-h-0">
            <div className="space-y-2">
              {filteredCrops.map(crop => (
                <label
                  key={crop}
                  className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                >
                  <Checkbox
                    checked={selectedCrops.includes(crop)}
                    onCheckedChange={() => handleToggleCrop(crop)}
                  />
                  <span className="text-sm flex-1">{crop}</span>
                </label>
              ))}
            </div>
          </ScrollArea>

          {/* Custom Crop Input */}
          <div className="space-y-2 border-t pt-4">
            <p className="text-sm font-medium">Add Custom Crop</p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter crop name..."
                value={customCrop}
                onChange={(e) => setCustomCrop(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
              />
              <Button onClick={handleAddCustom} disabled={!customCrop.trim()}>
                Add
              </Button>
            </div>
          </div>

          {/* Selected Count */}
          {selectedCrops.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {selectedCrops.length} crop{selectedCrops.length !== 1 ? 's' : ''} selected
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onClose} className="flex-1">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}