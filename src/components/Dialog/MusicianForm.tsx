import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Musician } from '../../types/types';
import { storageService } from '../../services/storage';
import { resizeImage } from '../../utils/imageUtils';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.blue[900]};
  font-weight: 500;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 2px solid ${({ theme }) => theme.colors.blue[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.blue[500]};
    box-shadow: ${({ theme }) => theme.shadows.highlight};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 2px solid ${({ theme }) => theme.colors.blue[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.blue[500]};
    box-shadow: ${({ theme }) => theme.shadows.highlight};
  }
`;

const ImagePreview = styled.div<{ hasImage: boolean }>`
  width: 100px;
  height: 100px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  border: 2px dashed ${({ theme, hasImage }) =>
    hasImage ? theme.colors.blue[500] : theme.colors.blue[200]};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s;
  text-align: center;
  color: ${({ theme }) => theme.colors.blue[600]};
  font-size: 0.9rem;
  padding: ${({ theme }) => theme.spacing.xs};

  &:hover {
    border-color: ${({ theme }) => theme.colors.blue[500]};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UploadText = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

interface Props {
  musician?: Musician;
  instruments: string[];
  onSubmit: (musician: Partial<Musician>, imageFile?: File) => void;
  id?: string; // Add id prop for form identification
}

const MusicianFormComponent: React.FC<Props> = ({
  musician,
  instruments = [], // Provide default empty array
  onSubmit,
  id = 'musician-form'
}) => {
  const [formData, setFormData] = useState({
    name: musician?.name || '',
    instrument: musician?.instrument || '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (musician) {
      setFormData({
        name: musician.name,
        instrument: musician.instrument
      });

      // Try to load existing avatar
      const existingAvatar = storageService.getAvatar(musician.name);
      if (existingAvatar) {
        setImagePreview(existingAvatar);
      }
    } else {
      // Reset form when creating new musician
      setFormData({ name: '', instrument: '' });
      setImagePreview(null);
    }
  }, [musician]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Show resized version in preview
        const resizedImage = await resizeImage(file, 200, 200, 0.8);
        setImagePreview(resizedImage);
      } catch (error) {
        console.error('Error resizing image:', error);
        // Fallback to original file preview
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const imageFile = fileInputRef.current?.files?.[0];
    onSubmit(formData, imageFile);
  };

  return (
    <Form onSubmit={handleSubmit} id={id}>
      <FormGroup>
        <Label>Imagen</Label>
        <ImagePreview hasImage={!!imagePreview} onClick={handleImageClick}>
          {imagePreview ? (
            <img src={imagePreview} alt={formData.name || 'Preview'} />
          ) : (
            <UploadText>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6v12m0-12L8 10m4-4l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Subir imagen
            </UploadText>
          )}
        </ImagePreview>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </FormGroup>

      <FormGroup>
        <Label>Nombre</Label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Instrumento</Label>
        <Select
          value={formData.instrument}
          onChange={(e) => setFormData(prev => ({ ...prev, instrument: e.target.value }))}
          required
        >
          <option value="">Seleccionar instrumento...</option>
          {Array.isArray(instruments) && instruments.map(inst => (
            <option key={inst} value={inst}>{inst}</option>
          ))}
        </Select>
      </FormGroup>
    </Form>
  );
};

export const MusicianForm = MusicianFormComponent;
