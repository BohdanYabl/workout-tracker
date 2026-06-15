import * as ImagePicker from 'expo-image-picker';
import { File as FSFile } from 'expo-file-system';
import { supabase } from './supabase';
import type { ProgressPhoto } from '../types';

const BUCKET = 'progress-photos';

interface ProgressPhotoRow {
  id: string;
  user_id: string;
  uri: string;
  date: string;
  notes: string | null;
  created_at: string;
}

function fromRow(row: ProgressPhotoRow): ProgressPhoto {
  return { id: row.id, uri: row.uri, date: row.date, notes: row.notes ?? undefined };
}

export async function pickPhotoFromGallery(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
    exif: false,
  });
  return result.canceled ? null : result.assets[0].uri;
}

export async function takePhotoWithCamera(): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') return null;

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
    exif: false,
  });
  return result.canceled ? null : result.assets[0].uri;
}

// Reads a local file:// URI via expo-file-system's new File API, converts to
// Uint8Array, and uploads to Supabase Storage. The old fetch+Blob approach
// fails on iOS simulator because the JS engine cannot read file:// URIs.
async function uploadToStorage(localUri: string, userId: string): Promise<string> {
  const ext = (localUri.split('.').pop()?.toLowerCase() ?? 'jpg').split('?')[0];
  const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
  const path = `${userId}/${Date.now()}.${ext}`;

  const file = new FSFile(localUri);
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: mimeType });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function getProgressPhotos(): Promise<ProgressPhoto[]> {
  const { data, error } = await supabase
    .from('progress_photos')
    .select('*')
    .order('date', { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as ProgressPhotoRow[]).map(fromRow);
}

export type CreatePhotoData = Omit<ProgressPhoto, 'id'>;

export async function addProgressPhoto(input: CreatePhotoData): Promise<ProgressPhoto> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw new Error(userError.message);
  if (!user) throw new Error('Not authenticated');

  const publicUrl = await uploadToStorage(input.uri, user.id);

  const { data, error } = await supabase
    .from('progress_photos')
    .insert({ user_id: user.id, uri: publicUrl, date: input.date, notes: input.notes ?? null })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as unknown as ProgressPhotoRow);
}

export async function deleteProgressPhoto(id: string): Promise<void> {
  const { error } = await supabase.from('progress_photos').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
