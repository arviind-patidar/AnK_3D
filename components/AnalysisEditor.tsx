'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Check } from 'lucide-react';
import { FloorPlanJSON, Room, RoomType } from '@/lib/planSchema';
import { calculateDimensionSqFt } from '@/lib/imageProcessing';

interface AnalysisEditorProps {
  planJson: FloorPlanJSON;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPlanJson: FloorPlanJSON) => void;
}

export const AnalysisEditor: React.FC<AnalysisEditorProps> = ({
  planJson,
  isOpen,
  onClose,
  onSave,
}) => {
  const [editedPlan, setEditedPlan] = useState<FloorPlanJSON>(JSON.parse(JSON.stringify(planJson)));
  const [activeFloorKey, setActiveFloorKey] = useState<string>(Object.keys(planJson.floors)[0] || 'lower');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentFloor = editedPlan.floors[activeFloorKey];

  const handleRoomChange = (roomId: string, field: keyof Room, value: any) => {
    setEditedPlan((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const floor = next.floors[activeFloorKey];
      const room = floor.rooms.find((r: Room) => r.id === roomId);
      if (room) {
        (room as any)[field] = value;
        // Auto calculate area if dimensions changed
        if (field === 'dimensions') {
          const derivedSqFt = calculateDimensionSqFt(value as string);
          room.calculatedSqFt = derivedSqFt;
        }
      }
      return next;
    });
  };

  const handleAddRoom = () => {
    setEditedPlan((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const floor = next.floors[activeFloorKey];
      const newRoom: Room = {
        id: `room_${Date.now()}`,
        code: 'RM',
        name: 'New Custom Room',
        type: 'bedroom',
        polygon: [
          [0.2, 0.2],
          [0.4, 0.2],
          [0.4, 0.4],
          [0.2, 0.4],
        ],
        doors: [],
        windows: [],
        furniture: [],
        dimensions: "12'0\" × 10'0\"",
        calculatedSqFt: 120,
        isCarpetArea: false,
        floorKey: activeFloorKey,
      };
      floor.rooms.push(newRoom);
      return next;
    });
  };

  const handleDeleteRoom = (roomId: string) => {
    setEditedPlan((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const floor = next.floors[activeFloorKey];
      floor.rooms = floor.rooms.filter((r: Room) => r.id !== roomId);
      return next;
    });
  };

  const handleSaveClick = () => {
    onSave(editedPlan);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end">
      <div className="bg-[#FAF8F5] max-w-4xl w-full h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l-2 border-[#B88E52]">
        {/* Drawer Header */}
        <div className="bg-[#1F2B38] text-[#F7F3EC] px-6 py-4 border-b border-[#B88E52] flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#F7F3EC] tracking-wide">
              Edit Plan Analysis Data
            </h3>
            <p className="text-xs text-[#D4AF77]">
              Manual Correction UI: Adjust room codes, names, printed dimensions, and sq ft
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#141D26] text-[#D4AF77] hover:text-white flex items-center justify-center border border-[#B88E52]/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Floor Selection Bar */}
        <div className="bg-[#EFECE6] px-6 py-3 border-b border-[#E2DCD2] flex items-center justify-between">
          <div className="flex gap-2">
            {Object.keys(editedPlan.floors).map((fk) => (
              <button
                key={fk}
                type="button"
                onClick={() => setActiveFloorKey(fk)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeFloorKey === fk
                    ? 'bg-[#1F2B38] text-[#F7F3EC] border border-[#B88E52]'
                    : 'bg-white text-[#1F2B38] border border-[#C8C0B2] hover:border-[#B88E52]'
                }`}
              >
                {editedPlan.floors[fk].floorName || fk.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddRoom}
            className="inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Room</span>
          </button>
        </div>

        {/* Room Editing Table Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
          {currentFloor && currentFloor.rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white border border-[#C8C0B2] rounded-xl p-4 shadow-sm hover:border-[#B88E52] transition grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
            >
              {/* Code */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-[#718096] uppercase">Code</label>
                <input
                  type="text"
                  value={room.code}
                  onChange={(e) => handleRoomChange(room.id, 'code', e.target.value)}
                  className="w-full px-2 py-1 bg-[#F7F3EC] border border-[#C8C0B2] rounded text-xs font-bold text-[#1F2B38] focus:ring-1 focus:ring-[#B88E52]"
                />
              </div>

              {/* Room Name */}
              <div className="md:col-span-4">
                <label className="block text-[10px] font-bold text-[#718096] uppercase">Room Name</label>
                <input
                  type="text"
                  value={room.name}
                  onChange={(e) => handleRoomChange(room.id, 'name', e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-[#C8C0B2] rounded text-xs text-[#1F2B38] focus:ring-1 focus:ring-[#B88E52]"
                />
              </div>

              {/* Dimensions */}
              <div className="md:col-span-3">
                <label className="block text-[10px] font-bold text-[#718096] uppercase">Printed Dimension</label>
                <input
                  type="text"
                  value={room.dimensions}
                  onChange={(e) => handleRoomChange(room.id, 'dimensions', e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-[#C8C0B2] rounded text-xs text-[#1F2B38] focus:ring-1 focus:ring-[#B88E52]"
                />
              </div>

              {/* Sq Ft */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-[#718096] uppercase">Derived Sq Ft</label>
                <input
                  type="text"
                  value={room.calculatedSqFt}
                  onChange={(e) =>
                    handleRoomChange(
                      room.id,
                      'calculatedSqFt',
                      e.target.value.toUpperCase() === 'NR' ? 'NR' : parseInt(e.target.value, 10) || 0
                    )
                  }
                  className="w-full px-2 py-1 bg-[#F7F3EC] border border-[#C8C0B2] rounded text-xs font-bold text-[#1F2B38] focus:ring-1 focus:ring-[#B88E52]"
                />
              </div>

              {/* Delete Button */}
              <div className="md:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleDeleteRoom(room.id)}
                  className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition border border-rose-200"
                  title="Delete Room"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Drawer Footer */}
        <div className="bg-[#EFECE6] px-6 py-4 border-t border-[#E2DCD2] flex items-center justify-between">
          <span className="text-xs text-[#718096]">
            Edits update spatial index and 3D labels instantly without full regeneration.
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-[#1F2B38] border border-[#C8C0B2] rounded-xl text-xs font-bold hover:bg-[#FAF8F5]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveClick}
              className="px-6 py-2 bg-[#1F2B38] text-[#F7F3EC] border border-[#B88E52] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#141D26] flex items-center gap-2 shadow-md"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4 text-[#B88E52]" />}
              <span>{savedSuccess ? 'Saved Changes!' : 'Save & Update Model'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
