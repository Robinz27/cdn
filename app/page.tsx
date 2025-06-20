'use client';

import Image from 'next/image';
import React, { useState, useRef } from 'react';
import { Upload, Copy, Check, ImageIcon, X } from 'lucide-react';

export default function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedLink, setUploadedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  
  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setUploadedLink('');
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };


  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
  if (!selectedFile) {
    setError('กรุณาเลือกไฟล์รูปภาพ');
    return;
  }

  setIsUploading(true);
  setError('');

  try {
    const formData = new FormData();
      formData.append('source', selectedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status_code === 200 && result.image) {
        setUploadedLink(result.image.url);
      } else {
        throw new Error(result.error?.message || 'Upload failed');
      }
    } catch (err) {
      const error = err as Error;
      console.error('Upload error:', error);
      setError(error.message || 'เกิดข้อผิดพลาดในการอัปโหลด');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(uploadedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadedLink('');
    setCopied(false);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            4TUNEZ - CLOUD
          </h1>
          <p className="text-gray-400">บริการรับฝากรูปภาพ บริการตลอด 24 ชั่วโมง สะดวก, รวดเร็ว, ปลอดภัย</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Upload Area */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-6">
            {!selectedFile ? (
              <div
                className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-400/10' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileSelect(e.target.files[0])
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-gray-700/50 rounded-full">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-300 mb-2">
                      วางรูปภาพที่นี่ หรือคลิกเพื่อเลือกไฟล์
                    </p>
                    <p className="text-sm text-gray-500">
                      รองรับไฟล์ JPG, PNG, GIF (ขนาดไม่เกิน 10MB)
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Preview */}
                <div className="relative">
                  <Image
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    width={800}
                    height={500}
                    className="w-full max-h-64 object-contain rounded-lg bg-gray-900"
                    unoptimized
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* File Info */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">ชื่อไฟล์:</span> {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">ขนาด:</span> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {/* Upload Button */}
                {!uploadedLink && (
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>กำลังอัปโหลด...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>อัปโหลดรูปภาพ</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-2">
                <X className="w-5 h-5 text-red-400" />
                <p className="text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Result */}
          {uploadedLink && (
            <div className="bg-green-900/20 border border-green-700 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Check className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-medium text-green-400">อัปโหลดสำเร็จ!</h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-gray-300 text-sm">ลิงก์รูปภาพของคุณ:</p>
                
                <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-3">
                  <input
                    type="text"
                    value={uploadedLink}
                    readOnly
                    className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm">{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                  </button>
                </div>
                
                <button
                  onClick={handleReset}
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  อัปโหลดรูปใหม่
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="max-w-2xl mx-auto mt-8 bg-gray-800/30 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-medium text-gray-300 mb-3">วิธีใช้งาน:</h3>
          <ol className="space-y-2 text-sm text-gray-400">
            <li>1. เลือกรูปภาพที่ต้องการอัปโหลด (ลากวางหรือคลิกเลือก)</li>
            <li>2. ตรวจสอบตัวอย่างรูปภาพ</li>
            <li>3. คลิก &quot;อัปโหลดรูปภาพ&quot;</li>
            <li>4. รอสักครู่ให้ระบบประมวลผล</li>
            <li>5. คัดลอกลิงก์ที่ได้มาใช้งาน</li>
          </ol>
          
          <div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded-lg">
            <p className="text-green-400 text-sm">
              <strong>พร้อมใช้งาน!</strong> บริการรับฝากรูปภาพ เพียงเลือกรูปภาพและอัปโหลดได้เลย
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}