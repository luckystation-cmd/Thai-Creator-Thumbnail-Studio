
export interface Expression {
  id: string;
  label: string;
  prompt: string;
  icon: string;
  isSelected: boolean;
}

export interface StyleOption {
  id: string;
  label: string;
  prompt: string;
  icon: string;
}

export interface BeautySettings {
  smoothSkin: boolean;
  whiteSkin: boolean;
  removeBlemishes: boolean;
  noBeard: boolean;
}

export interface GeneratedImage {
  id: string;
  expressionLabel: string;
  styleLabel?: string;
  url: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
  error?: string;
}

export interface ReferenceImage {
  id: string;
  base64: string;
  previewUrl: string;
  mimeType: string;
}
