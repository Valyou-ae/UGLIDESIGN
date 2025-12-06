import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Type, 
  Download, 
  X, 
  Plus, 
  Trash2, 
  Move,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  RotateCcw,
  Check,
  GripVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";

interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  align: "left" | "center" | "right";
  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  glowEnabled: boolean;
  glowColor: string;
  glowBlur: number;
}

interface TextCompositorProps {
  backgroundImage: string;
  detectedTexts: string[];
  onSave: (compositeImageUrl: string) => void;
  onClose: () => void;
}

const FONTS = [
  { value: "Inter", label: "Inter" },
  { value: "Arial", label: "Arial" },
  { value: "Georgia", label: "Georgia" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
  { value: "Impact", label: "Impact" },
  { value: "Comic Sans MS", label: "Comic Sans" },
  { value: "Trebuchet MS", label: "Trebuchet" },
  { value: "Verdana", label: "Verdana" },
  { value: "Palatino Linotype", label: "Palatino" },
];

const PRESET_COLORS = [
  "#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF",
  "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080",
  "#008000", "#800000", "#008080", "#000080", "#808080",
];

export function TextCompositor({ 
  backgroundImage, 
  detectedTexts, 
  onSave, 
  onClose 
}: TextCompositorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const selectedLayer = textLayers.find(l => l.id === selectedLayerId);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setBgImage(img);
      setCanvasSize({ width: img.width, height: img.height });
    };
    img.src = backgroundImage;
  }, [backgroundImage]);

  useEffect(() => {
    if (detectedTexts.length > 0 && textLayers.length === 0) {
      const initialLayers: TextLayer[] = detectedTexts.map((text, index) => ({
        id: `layer-${Date.now()}-${index}`,
        text,
        x: canvasSize.width / 2,
        y: 100 + index * 80,
        fontSize: 48,
        fontFamily: "Inter",
        color: "#FFFFFF",
        bold: true,
        italic: false,
        align: "center",
        shadowEnabled: true,
        shadowColor: "#000000",
        shadowBlur: 4,
        shadowOffsetX: 2,
        shadowOffsetY: 2,
        glowEnabled: false,
        glowColor: "#FFFFFF",
        glowBlur: 10,
      }));
      setTextLayers(initialLayers);
      if (initialLayers.length > 0) {
        setSelectedLayerId(initialLayers[0].id);
      }
    }
  }, [detectedTexts, canvasSize]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !bgImage) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    ctx.drawImage(bgImage, 0, 0, canvasSize.width, canvasSize.height);

    for (const layer of textLayers) {
      ctx.save();

      let fontStyle = "";
      if (layer.italic) fontStyle += "italic ";
      if (layer.bold) fontStyle += "bold ";
      ctx.font = `${fontStyle}${layer.fontSize}px "${layer.fontFamily}"`;
      ctx.textAlign = layer.align;
      ctx.textBaseline = "middle";

      if (layer.glowEnabled) {
        ctx.shadowColor = layer.glowColor;
        ctx.shadowBlur = layer.glowBlur;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillStyle = layer.color;
        ctx.fillText(layer.text, layer.x, layer.y);
        ctx.fillText(layer.text, layer.x, layer.y);
      }

      if (layer.shadowEnabled) {
        ctx.shadowColor = layer.shadowColor;
        ctx.shadowBlur = layer.shadowBlur;
        ctx.shadowOffsetX = layer.shadowOffsetX;
        ctx.shadowOffsetY = layer.shadowOffsetY;
      } else {
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = layer.color;
      ctx.fillText(layer.text, layer.x, layer.y);

      if (layer.id === selectedLayerId) {
        const metrics = ctx.measureText(layer.text);
        const textWidth = metrics.width;
        const textHeight = layer.fontSize;
        
        let boxX = layer.x - textWidth / 2;
        if (layer.align === "left") boxX = layer.x;
        if (layer.align === "right") boxX = layer.x - textWidth;
        
        ctx.shadowColor = "transparent";
        ctx.strokeStyle = "#3B82F6";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
          boxX - 10,
          layer.y - textHeight / 2 - 10,
          textWidth + 20,
          textHeight + 20
        );
        ctx.setLineDash([]);
      }

      ctx.restore();
    }
  }, [bgImage, canvasSize, textLayers, selectedLayerId]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasSize.width / rect.width;
    const scaleY = canvasSize.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    for (let i = textLayers.length - 1; i >= 0; i--) {
      const layer = textLayers[i];
      const canvas2d = canvas.getContext("2d");
      if (!canvas2d) continue;

      let fontStyle = "";
      if (layer.italic) fontStyle += "italic ";
      if (layer.bold) fontStyle += "bold ";
      canvas2d.font = `${fontStyle}${layer.fontSize}px "${layer.fontFamily}"`;
      
      const metrics = canvas2d.measureText(layer.text);
      const textWidth = metrics.width;
      const textHeight = layer.fontSize;

      let boxX = layer.x - textWidth / 2;
      if (layer.align === "left") boxX = layer.x;
      if (layer.align === "right") boxX = layer.x - textWidth;

      if (
        x >= boxX - 10 &&
        x <= boxX + textWidth + 10 &&
        y >= layer.y - textHeight / 2 - 10 &&
        y <= layer.y + textHeight / 2 + 10
      ) {
        setSelectedLayerId(layer.id);
        setIsDragging(true);
        setDragOffset({ x: x - layer.x, y: y - layer.y });
        return;
      }
    }

    setSelectedLayerId(null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedLayerId) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasSize.width / rect.width;
    const scaleY = canvasSize.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setTextLayers(layers =>
      layers.map(layer =>
        layer.id === selectedLayerId
          ? { ...layer, x: x - dragOffset.x, y: y - dragOffset.y }
          : layer
      )
    );
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const updateSelectedLayer = (updates: Partial<TextLayer>) => {
    if (!selectedLayerId) return;
    setTextLayers(layers =>
      layers.map(layer =>
        layer.id === selectedLayerId ? { ...layer, ...updates } : layer
      )
    );
  };

  const addNewTextLayer = () => {
    const newLayer: TextLayer = {
      id: `layer-${Date.now()}`,
      text: "New Text",
      x: canvasSize.width / 2,
      y: canvasSize.height / 2,
      fontSize: 48,
      fontFamily: "Inter",
      color: "#FFFFFF",
      bold: true,
      italic: false,
      align: "center",
      shadowEnabled: true,
      shadowColor: "#000000",
      shadowBlur: 4,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      glowEnabled: false,
      glowColor: "#FFFFFF",
      glowBlur: 10,
    };
    setTextLayers([...textLayers, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const deleteSelectedLayer = () => {
    if (!selectedLayerId) return;
    setTextLayers(layers => layers.filter(l => l.id !== selectedLayerId));
    setSelectedLayerId(null);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setSelectedLayerId(null);
    
    setTimeout(() => {
      drawCanvas();
      setTimeout(() => {
        const dataUrl = canvas.toDataURL("image/png");
        onSave(dataUrl);
      }, 50);
    }, 50);
  };

  const displayScale = Math.min(
    (containerRef.current?.clientWidth || 800) / canvasSize.width,
    (containerRef.current?.clientHeight || 600) / canvasSize.height,
    1
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex">
      <div className="flex-1 flex flex-col p-4" ref={containerRef}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Type className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Text Compositor</h2>
              <p className="text-sm text-white/60">Add text with 100% accuracy</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-white/20 text-white hover:bg-white/10"
              data-testid="button-compositor-cancel"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              data-testid="button-compositor-save"
            >
              <Check className="w-4 h-4 mr-2" />
              Save Image
            </Button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              cursor: isDragging ? "grabbing" : "grab",
            }}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            data-testid="canvas-compositor"
          />
        </div>
      </div>

      <div className="w-80 bg-zinc-900 border-l border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white">Text Layers</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={addNewTextLayer}
              className="h-7 text-white/70 hover:text-white hover:bg-white/10"
              data-testid="button-add-text-layer"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          <ScrollArea className="h-32">
            <div className="space-y-1">
              {textLayers.map((layer, index) => (
                <div
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors",
                    layer.id === selectedLayerId
                      ? "bg-blue-500/20 border border-blue-500/50"
                      : "hover:bg-white/5"
                  )}
                  data-testid={`layer-item-${index}`}
                >
                  <GripVertical className="w-4 h-4 text-white/30" />
                  <Type className="w-4 h-4 text-white/50" />
                  <span className="flex-1 text-sm text-white truncate">
                    {layer.text}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {selectedLayer && (
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              <div>
                <Label className="text-white/70 text-xs mb-2 block">Text Content</Label>
                <Input
                  value={selectedLayer.text}
                  onChange={(e) => updateSelectedLayer({ text: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  data-testid="input-text-content"
                />
              </div>

              <div>
                <Label className="text-white/70 text-xs mb-2 block">Font Family</Label>
                <Select
                  value={selectedLayer.fontFamily}
                  onValueChange={(value) => updateSelectedLayer({ fontFamily: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-font-family">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONTS.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span style={{ fontFamily: font.value }}>{font.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white/70 text-xs mb-2 block">
                  Font Size: {selectedLayer.fontSize}px
                </Label>
                <Slider
                  value={[selectedLayer.fontSize]}
                  onValueChange={([value]) => updateSelectedLayer({ fontSize: value })}
                  min={12}
                  max={200}
                  step={1}
                  className="py-2"
                  data-testid="slider-font-size"
                />
              </div>

              <div>
                <Label className="text-white/70 text-xs mb-2 block">Text Color</Label>
                <div className="flex flex-wrap gap-1">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateSelectedLayer({ color })}
                      className={cn(
                        "w-6 h-6 rounded border-2 transition-all",
                        selectedLayer.color === color
                          ? "border-blue-500 scale-110"
                          : "border-transparent hover:border-white/30"
                      )}
                      style={{ backgroundColor: color }}
                      data-testid={`color-${color.replace('#', '')}`}
                    />
                  ))}
                </div>
                <Input
                  type="color"
                  value={selectedLayer.color}
                  onChange={(e) => updateSelectedLayer({ color: e.target.value })}
                  className="w-full h-8 mt-2 cursor-pointer"
                  data-testid="input-custom-color"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={selectedLayer.bold ? "default" : "outline"}
                  onClick={() => updateSelectedLayer({ bold: !selectedLayer.bold })}
                  className="flex-1"
                  data-testid="button-bold"
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={selectedLayer.italic ? "default" : "outline"}
                  onClick={() => updateSelectedLayer({ italic: !selectedLayer.italic })}
                  className="flex-1"
                  data-testid="button-italic"
                >
                  <Italic className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <Label className="text-white/70 text-xs mb-2 block">Text Align</Label>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={selectedLayer.align === "left" ? "default" : "outline"}
                    onClick={() => updateSelectedLayer({ align: "left" })}
                    className="flex-1"
                    data-testid="button-align-left"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedLayer.align === "center" ? "default" : "outline"}
                    onClick={() => updateSelectedLayer({ align: "center" })}
                    className="flex-1"
                    data-testid="button-align-center"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedLayer.align === "right" ? "default" : "outline"}
                    onClick={() => updateSelectedLayer({ align: "right" })}
                    className="flex-1"
                    data-testid="button-align-right"
                  >
                    <AlignRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-white/70 text-xs">Drop Shadow</Label>
                  <Switch
                    checked={selectedLayer.shadowEnabled}
                    onCheckedChange={(checked) => updateSelectedLayer({ shadowEnabled: checked })}
                    data-testid="switch-shadow"
                  />
                </div>
                {selectedLayer.shadowEnabled && (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-white/50 text-xs mb-1 block">Shadow Blur: {selectedLayer.shadowBlur}px</Label>
                      <Slider
                        value={[selectedLayer.shadowBlur]}
                        onValueChange={([value]) => updateSelectedLayer({ shadowBlur: value })}
                        min={0}
                        max={20}
                        step={1}
                        data-testid="slider-shadow-blur"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label className="text-white/50 text-xs mb-1 block">X: {selectedLayer.shadowOffsetX}</Label>
                        <Slider
                          value={[selectedLayer.shadowOffsetX]}
                          onValueChange={([value]) => updateSelectedLayer({ shadowOffsetX: value })}
                          min={-20}
                          max={20}
                          step={1}
                          data-testid="slider-shadow-x"
                        />
                      </div>
                      <div className="flex-1">
                        <Label className="text-white/50 text-xs mb-1 block">Y: {selectedLayer.shadowOffsetY}</Label>
                        <Slider
                          value={[selectedLayer.shadowOffsetY]}
                          onValueChange={([value]) => updateSelectedLayer({ shadowOffsetY: value })}
                          min={-20}
                          max={20}
                          step={1}
                          data-testid="slider-shadow-y"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-white/70 text-xs">Glow Effect</Label>
                  <Switch
                    checked={selectedLayer.glowEnabled}
                    onCheckedChange={(checked) => updateSelectedLayer({ glowEnabled: checked })}
                    data-testid="switch-glow"
                  />
                </div>
                {selectedLayer.glowEnabled && (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-white/50 text-xs mb-1 block">Glow Blur: {selectedLayer.glowBlur}px</Label>
                      <Slider
                        value={[selectedLayer.glowBlur]}
                        onValueChange={([value]) => updateSelectedLayer({ glowBlur: value })}
                        min={0}
                        max={30}
                        step={1}
                        data-testid="slider-glow-blur"
                      />
                    </div>
                    <div>
                      <Label className="text-white/50 text-xs mb-1 block">Glow Color</Label>
                      <Input
                        type="color"
                        value={selectedLayer.glowColor}
                        onChange={(e) => updateSelectedLayer({ glowColor: e.target.value })}
                        className="w-full h-8 cursor-pointer"
                        data-testid="input-glow-color"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-4">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={deleteSelectedLayer}
                  className="w-full"
                  data-testid="button-delete-layer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Layer
                </Button>
              </div>
            </div>
          </ScrollArea>
        )}

        {!selectedLayer && (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center text-white/40">
              <Type className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select a text layer to edit</p>
              <p className="text-xs mt-1">or drag text on the canvas</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
