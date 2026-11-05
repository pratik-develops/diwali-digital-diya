"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  Download,
  LoaderCircle,
  RefreshCcw,
  Share2,
  Sparkles,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const FILTERS = [
  { id: "clear", label: "Natural Light", accent: "#f5d28f" },
  { id: "golden-glow", label: "Golden Glow", accent: "#f5d28f" },
  { id: "diya-dreams", label: "Diya Dreams", accent: "#ff9a40" },
  { id: "royal-diwali", label: "Royal Diwali", accent: "#cda767" },
  { id: "marigold-magic", label: "Marigold Magic", accent: "#ffb347" },
  { id: "fireworks-night", label: "Fireworks Night", accent: "#a77aff" },
  { id: "rangoli-frame", label: "Rangoli Frame", accent: "#41c5b7" },
  { id: "peacock-festive", label: "Peacock Festive", accent: "#48b9d1" },
  { id: "festive-toran", label: "Festive Toran", accent: "#68ae74" },
  { id: "fairy-lights", label: "Fairy Lights", accent: "#ffe6a0" },
  { id: "golden-bulbs", label: "Golden Bulbs", accent: "#ffca62" },
  { id: "bokeh-lights", label: "Bokeh Lights", accent: "#ffd987" },
  { id: "diwali-night", label: "Diwali Night", accent: "#6585d8" },
  { id: "sparkling-lights", label: "Sparkling Lights", accent: "#ffe28a" },
  { id: "golden-dust", label: "Golden Dust", accent: "#e8b957" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];
type FacingMode = "user" | "environment";

const FILTER_STYLES: Record<FilterId, string> = {
  clear: "none",
  "golden-glow": "sepia(.18) saturate(1.18) brightness(1.06)",
  "diya-dreams": "sepia(.16) saturate(1.45) brightness(1.08)",
  "royal-diwali": "sepia(.2) saturate(1.18) contrast(1.07)",
  "marigold-magic": "sepia(.12) saturate(1.55) brightness(1.04)",
  "fireworks-night": "saturate(1.25) contrast(1.12) brightness(.93)",
  "rangoli-frame": "saturate(1.4) contrast(1.04)",
  "peacock-festive": "saturate(1.35) hue-rotate(7deg)",
  "festive-toran": "sepia(.08) saturate(1.2) contrast(1.03)",
  "fairy-lights": "sepia(.08) saturate(1.14) brightness(1.04)",
  "golden-bulbs": "sepia(.12) saturate(1.2) brightness(1.04)",
  "bokeh-lights": "saturate(1.12) contrast(1.02)",
  "diwali-night": "saturate(1.12) contrast(1.06) brightness(.88) hue-rotate(4deg)",
  "sparkling-lights": "sepia(.08) saturate(1.16) brightness(1.04)",
  "golden-dust": "sepia(.08) saturate(1.12) brightness(1.03)",
};

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function drawSparkle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x, y - radius);
  context.lineTo(x + radius * 0.3, y - radius * 0.3);
  context.lineTo(x + radius, y);
  context.lineTo(x + radius * 0.3, y + radius * 0.3);
  context.lineTo(x, y + radius);
  context.lineTo(x - radius * 0.3, y + radius * 0.3);
  context.lineTo(x - radius, y);
  context.lineTo(x - radius * 0.3, y - radius * 0.3);
  context.closePath();
  context.fill();
}

function drawFloralCorner(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  color: string,
) {
  context.save();
  context.translate(x, y);
  context.fillStyle = color;
  for (let petal = 0; petal < 8; petal += 1) {
    context.rotate(Math.PI / 4);
    context.beginPath();
    context.ellipse(0, -12 * scale, 4 * scale, 10 * scale, 0, 0, Math.PI * 2);
    context.fill();
  }
  context.fillStyle = "#ffdf85";
  context.beginPath();
  context.arc(0, 0, 3 * scale, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawDiya(context: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  context.save();
  context.translate(x, y);
  context.shadowColor = "rgba(255, 164, 52, .9)";
  context.shadowBlur = 20 * scale;
  context.fillStyle = "#ffb851";
  context.beginPath();
  context.moveTo(-20 * scale, 0);
  context.quadraticCurveTo(0, 16 * scale, 20 * scale, 0);
  context.quadraticCurveTo(0, 8 * scale, -20 * scale, 0);
  context.fill();
  context.shadowBlur = 0;
  context.fillStyle = "#fff1bd";
  context.beginPath();
  context.ellipse(0, -10 * scale, 5 * scale, 10 * scale, 0, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawFirework(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
) {
  context.save();
  context.strokeStyle = color;
  context.lineWidth = Math.max(1.5, radius * 0.06);
  context.shadowColor = color;
  context.shadowBlur = radius * 0.6;
  for (let ray = 0; ray < 12; ray += 1) {
    const angle = (Math.PI * 2 * ray) / 12;
    context.beginPath();
    context.moveTo(x + Math.cos(angle) * radius * 0.28, y + Math.sin(angle) * radius * 0.28);
    context.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
    context.stroke();
  }
  context.restore();
}

function drawRangoli(context: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  context.save();
  for (const [index, color] of ["#ff715b", "#ffcb5b", "#64d7bb", "#9d83ff"].entries()) {
    context.strokeStyle = color;
    context.lineWidth = Math.max(2, radius * 0.06);
    context.beginPath();
    context.ellipse(x, y, radius, radius * 0.36, (Math.PI * index) / 4, 0, Math.PI * 2);
    context.stroke();
  }
  context.fillStyle = "#fff2bc";
  context.beginPath();
  context.arc(x, y, radius * 0.13, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawLight(context: CanvasRenderingContext2D, x: number, y: number, scale: number, color: string) {
  context.save();
  context.fillStyle = color;
  context.shadowColor = color;
  context.shadowBlur = 12 * scale;
  context.beginPath();
  context.arc(x, y, 4 * scale, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawToran(context: CanvasRenderingContext2D, width: number, scale: number, inset: number) {
  context.save();
  context.strokeStyle = "rgba(91, 126, 67, .9)";
  context.lineWidth = Math.max(2, 3 * scale);
  context.beginPath();
  context.moveTo(inset, inset);
  context.quadraticCurveTo(width / 2, inset + 38 * scale, width - inset, inset);
  context.stroke();
  for (let index = 0; index <= 12; index += 1) {
    const x = inset + ((width - inset * 2) * index) / 12;
    const y = inset + Math.sin((Math.PI * index) / 12) * 38 * scale;
    context.save();
    context.translate(x, y);
    context.rotate(index % 2 ? 0.6 : -0.6);
    context.fillStyle = "#52794a";
    context.beginPath();
    context.ellipse(0, 7 * scale, 4 * scale, 10 * scale, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();
    if (index % 2 === 0) drawFloralCorner(context, x, y + 13 * scale, 0.48 * scale, "#ee982f");
  }
  context.restore();
}

function drawFilterOverlay(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  filterId: FilterId,
) {
  const scale = Math.min(width, height) / 720;
  const inset = Math.max(12, 20 * scale);
  const accent = FILTERS.find((filter) => filter.id === filterId)?.accent ?? "#f5d28f";
  const cornerSize = 12 * scale;

  if (filterId === "clear") return;

  context.save();

  const warm = context.createRadialGradient(
    width * 0.5,
    height * 0.45,
    0,
    width * 0.5,
    height * 0.45,
    Math.max(width, height) * 0.72,
  );
  warm.addColorStop(0, "rgba(255,255,255,0)");
  warm.addColorStop(1, `${accent}30`);
  context.fillStyle = warm;
  context.fillRect(0, 0, width, height);

  context.shadowColor = `${accent}aa`;
  context.shadowBlur = 18 * scale;
  context.strokeStyle = accent;
  context.lineWidth = Math.max(4, 8 * scale);
  roundedRect(context, inset, inset, width - inset * 2, height - inset * 2, 20 * scale);
  context.stroke();
  context.shadowBlur = 0;

  switch (filterId) {
    case "golden-glow": {
      for (let index = 0; index < 22; index += 1) {
        const x = ((index * 157) % (width - 2 * inset)) + inset;
        const y = ((index * 251) % (height - 2 * inset)) + inset;
        context.fillStyle = `rgba(255,248,207,${index % 2 ? 0.5 : 0.85})`;
        context.shadowColor = "#ffdd87";
        context.shadowBlur = 10 * scale;
        drawSparkle(context, x, y, (4 + (index % 4) * 1.6) * scale);
      }
      break;
    }
    case "diya-dreams":
      for (let index = 0; index < 5; index += 1) {
        drawDiya(context, width * (0.18 + index * 0.16), height - inset - 8 * scale, scale);
      }
      for (const x of [inset + 10 * scale, width - inset - 10 * scale]) {
        drawDiya(context, x, height * 0.22, 0.78 * scale);
      }
      break;
    case "royal-diwali":
      context.strokeStyle = "#f4d18c";
      context.lineWidth = Math.max(2, 3 * scale);
      roundedRect(context, inset + 12 * scale, inset + 12 * scale, width - (inset + 12 * scale) * 2, height - (inset + 12 * scale) * 2, 14 * scale);
      context.stroke();
      drawFloralCorner(context, inset + cornerSize, inset + cornerSize, scale, "#cf3554");
      drawFloralCorner(context, width - inset - cornerSize, inset + cornerSize, scale, "#cf3554");
      drawFloralCorner(context, inset + cornerSize, height - inset - cornerSize, scale, "#cf3554");
      drawFloralCorner(context, width - inset - cornerSize, height - inset - cornerSize, scale, "#cf3554");
      break;
    case "marigold-magic":
      for (let index = 0; index < 11; index += 1) {
        const x = inset + 12 * scale + index * ((width - 2 * inset - 24 * scale) / 10);
        drawFloralCorner(context, x, inset + 8 * scale, 0.8 * scale, index % 2 ? "#f5a623" : "#f07828");
        drawFloralCorner(context, x, height - inset - 8 * scale, 0.8 * scale, index % 2 ? "#f07828" : "#f5a623");
      }
      break;
    case "fireworks-night":
      drawFirework(context, width * 0.18, height * 0.2, 34 * scale, "#ffd75e");
      drawFirework(context, width * 0.79, height * 0.28, 26 * scale, "#e1a1ff");
      drawFirework(context, width * 0.68, height * 0.78, 20 * scale, "#77dbff");
      break;
    case "rangoli-frame":
      context.lineWidth = Math.max(3, 5 * scale);
      for (let index = 0; index < 4; index += 1) {
        const offset = inset + 14 * scale + index * 9 * scale;
        context.strokeStyle = ["#fc775c", "#ffcf63", "#43cbb7", "#ad83fb"][index];
        roundedRect(context, offset, offset, width - 2 * offset, height - 2 * offset, 18 * scale);
        context.stroke();
      }
      drawRangoli(context, inset + 45 * scale, inset + 45 * scale, 23 * scale);
      drawRangoli(context, width - inset - 45 * scale, inset + 45 * scale, 23 * scale);
      drawRangoli(context, inset + 45 * scale, height - inset - 45 * scale, 23 * scale);
      drawRangoli(context, width - inset - 45 * scale, height - inset - 45 * scale, 23 * scale);
      break;
    case "peacock-festive":
      for (const [x, y, rotation] of [
        [inset + 34 * scale, inset + 36 * scale, -0.5],
        [width - inset - 34 * scale, inset + 36 * scale, 0.5],
        [inset + 34 * scale, height - inset - 36 * scale, 0.5],
        [width - inset - 34 * scale, height - inset - 36 * scale, -0.5],
      ]) {
        context.save();
        context.translate(x, y);
        context.rotate(rotation);
        context.fillStyle = "#168f9b";
        context.strokeStyle = "#e7c879";
        context.lineWidth = 2 * scale;
        context.beginPath();
        context.ellipse(0, 0, 11 * scale, 25 * scale, 0, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.fillStyle = "#f2cb68";
        context.beginPath();
        context.ellipse(0, 0, 4 * scale, 11 * scale, 0, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
      break;
    case "festive-toran":
      drawToran(context, width, scale, inset);
      break;
    case "fairy-lights":
    case "golden-bulbs":
      context.strokeStyle = "rgba(255, 230, 172, .55)";
      context.lineWidth = Math.max(1, scale);
      context.beginPath();
      context.moveTo(inset, inset);
      context.quadraticCurveTo(width / 2, inset + 18 * scale, width - inset, inset);
      context.stroke();
      for (let index = 0; index <= 12; index += 1) {
        const x = inset + ((width - inset * 2) * index) / 12;
        const y = inset + Math.sin((Math.PI * index) / 12) * 18 * scale;
        drawLight(context, x, y + 5 * scale, scale, index % 2 ? "#fff2cc" : "#ffd16c");
        if (filterId === "fairy-lights") {
          drawLight(context, inset + 3 * scale, height * (index / 12), 0.72 * scale, "#ffe8a6");
          drawLight(context, width - inset - 3 * scale, height * (index / 12), 0.72 * scale, "#ffd16c");
        }
      }
      break;
    case "bokeh-lights":
      for (let index = 0; index < 12; index += 1) {
        const x = ((index * 173 + 59) % width);
        const y = ((index * 239 + 37) % height);
        const radius = (8 + (index % 4) * 4) * scale;
        context.beginPath();
        context.fillStyle = `rgba(255, ${190 + (index % 3) * 18}, 100, .${index % 2 ? "20" : "28"})`;
        context.shadowColor = "#ffc85e";
        context.shadowBlur = radius * 1.8;
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      }
      break;
    case "diwali-night":
      context.fillStyle = "rgba(19, 34, 91, .16)";
      context.fillRect(0, 0, width, height);
      drawLight(context, width * 0.16, height * 0.18, 1.8 * scale, "#ffe7a0");
      drawLight(context, width * 0.84, height * 0.25, 1.5 * scale, "#ffd16c");
      drawLight(context, width * 0.75, height * 0.78, 1.2 * scale, "#fff0bc");
      break;
    case "sparkling-lights":
    case "golden-dust":
      for (let index = 0; index < 26; index += 1) {
        const x = ((index * 157 + 23) % width);
        const y = ((index * 251 + 71) % height);
        context.fillStyle = `rgba(255, 225, 148, ${filterId === "golden-dust" ? 0.36 : 0.54})`;
        context.shadowColor = "#ffda79";
        context.shadowBlur = (filterId === "golden-dust" ? 4 : 8) * scale;
        if (filterId === "golden-dust") {
          context.beginPath();
          context.arc(x, y, (1.1 + (index % 3) * 0.55) * scale, 0, Math.PI * 2);
          context.fill();
        } else {
          drawSparkle(context, x, y, (2.5 + (index % 3)) * scale);
        }
      }
      break;
  }

  context.restore();
}

function getCameraError(error: unknown) {
  if (error instanceof Error && error.message === "CAMERA_PREVIEW_TIMEOUT") {
    return "The camera was granted access, but no live image arrived. Check the camera connection and try reopening it.";
  }
  if (!(error instanceof DOMException)) {
    return "The camera could not be started. Check browser permissions and try again.";
  }
  switch (error.name) {
    case "NotAllowedError":
    case "SecurityError":
      return "Camera permission was denied. Allow camera access in your browser settings, then try again.";
    case "NotFoundError":
    case "OverconstrainedError":
      return "No compatible camera was found on this device.";
    case "NotReadableError":
    case "AbortError":
      return "The camera is unavailable or already in use by another app. Close other camera apps and try again.";
    default:
      return `The camera could not start (${error.name}). Check browser permissions and try again.`;
  }
}

function waitForVideoFrame(video: HTMLVideoElement) {
  if (
    video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
    video.videoWidth > 0
  ) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      window.clearTimeout(timeout);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("error", onError);
    };
    const onReady = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("CAMERA_PREVIEW_TIMEOUT"));
    };
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("CAMERA_PREVIEW_TIMEOUT"));
    }, 10000);

    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("error", onError, { once: true });
  });
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return new Promise<T>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error("CAMERA_PREVIEW_TIMEOUT"));
    }, timeoutMs);

    promise.then(
      (value) => {
        window.clearTimeout(timeout);
        resolve(value);
      },
      (error: unknown) => {
        window.clearTimeout(timeout);
        reject(error);
      },
    );
  });
}

export function DiwaliCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestIdRef = useRef(0);
  const filterIdRef = useRef<FilterId>("golden-glow");
  const [facingMode, setFacingMode] = useState<FacingMode>("user");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterId>("golden-glow");
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const stopTracks = useCallback(() => {
    const stream = streamRef.current;
    streamRef.current = null;
    stream?.getTracks().forEach((track) => track.stop());
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    setIsVideoReady(false);
  }, []);

  const closeCamera = useCallback(() => {
    requestIdRef.current += 1;
    stopTracks();
    setCameraOpen(false);
    setIsLoading(false);
    setError(null);
  }, [stopTracks]);

  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
      const stream = streamRef.current;
      streamRef.current = null;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const startCamera = useCallback(
    async (mode: FacingMode) => {
      if (isLoading) return;
      if (!window.isSecureContext && window.location.hostname !== "localhost") {
        setError("Camera access requires HTTPS. Open this site over a secure connection or localhost.");
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("This browser does not support camera access. Try a current version of Safari, Chrome, or Firefox.");
        return;
      }

      requestIdRef.current += 1;
      const requestId = requestIdRef.current;
      setFacingMode(mode);
      setError(null);
      setNotice(null);
      setPhotoData(null);
      setCameraOpen(true);
      setIsLoading(true);
      setIsVideoReady(false);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (requestId !== requestIdRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) {
          stream.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
          throw new Error("The video preview is not available.");
        }

        video.srcObject = stream;
        await withTimeout(video.play(), 10000);
        await withTimeout(waitForVideoFrame(video), 10000);

        if (requestId !== requestIdRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        setIsVideoReady(true);
        stream.getVideoTracks().forEach((track) => {
          track.addEventListener(
            "ended",
            () => {
              if (requestId !== requestIdRef.current) return;
              stopTracks();
              setCameraOpen(false);
              setError("The camera stopped unexpectedly. Reopen it to try again.");
            },
            { once: true },
          );
        });
      } catch (cameraError) {
        if (requestId === requestIdRef.current) {
          stopTracks();
          setCameraOpen(false);
          setError(getCameraError(cameraError));
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [isLoading, stopTracks],
  );

  const toggleCamera = useCallback(async () => {
    if (cameraOpen || isLoading) {
      closeCamera();
      return;
    }
    await startCamera(facingMode);
  }, [cameraOpen, closeCamera, facingMode, isLoading, startCamera]);

  const switchCamera = useCallback(async () => {
    if (!cameraOpen || isLoading) return;
    const nextMode = facingMode === "user" ? "environment" : "user";
    requestIdRef.current += 1;
    stopTracks();
    setCameraOpen(false);
    setIsLoading(false);
    await startCamera(nextMode);
  }, [cameraOpen, facingMode, isLoading, startCamera, stopTracks]);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !video.videoWidth) {
      setError("The live preview is not ready yet. Wait for the camera image, then capture.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      setError("Unable to create the photograph in this browser.");
      return;
    }

    try {
      context.save();
      const filterId = filterIdRef.current;
      context.filter = FILTER_STYLES[filterId];
      if (facingMode === "user") {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
      }
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      context.restore();
      context.filter = "none";
      drawFilterOverlay(context, canvas.width, canvas.height, filterId);
      setPhotoData(canvas.toDataURL("image/png"));
      setError(null);
      setNotice(null);
    } catch (captureError) {
      console.error("Unable to capture Diwali camera photo.", captureError);
      setError("The photo could not be captured. Try again after the live preview appears.");
    }
  }, [facingMode]);

  const downloadPhoto = useCallback(() => {
    if (!photoData) return;
    const link = document.createElement("a");
    link.href = photoData;
    link.download = "diwali-camera-photo.png";
    link.click();
  }, [photoData]);

  const sharePhoto = useCallback(async () => {
    if (!photoData) return;
    try {
      const response = await fetch(photoData);
      const file = new File([await response.blob()], "diwali-camera-photo.png", {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Diwali Camera",
          text: "A festive memory captured during Diwali.",
          files: [file],
        });
      } else {
        downloadPhoto();
        setNotice("Photo sharing is not supported here, so the PNG download has started.");
      }
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === "AbortError") return;
      console.error("Unable to share Diwali camera photo.", shareError);
      downloadPhoto();
      setNotice("Sharing failed, so the PNG download has started instead.");
    }
  }, [downloadPhoto, photoData]);

  return (
    <section id="camera" className="mx-auto max-w-6xl px-4 py-20">
      <SectionHeading
        kicker="Capture the celebration"
        title="Diwali Camera"
        lead="Capture the magic. Wear the colours of Diwali."
      />

      <div className="mt-10 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="festive-card min-w-0 rounded-[2rem] p-4 sm:p-6">
          <div className="relative isolate aspect-[4/3] min-h-[18rem] w-full max-w-full overflow-hidden rounded-[1.6rem] border border-gold/30 bg-[#12010d] sm:aspect-video sm:min-h-0">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              aria-label="Live camera preview"
              className="absolute inset-0 h-full w-full object-cover transition-[filter,opacity] duration-300"
              style={{
                filter: FILTER_STYLES[selectedFilter],
                opacity: cameraOpen && isVideoReady ? 1 : 0,
                transform: facingMode === "user" ? "scaleX(-1)" : undefined,
              }}
            />
            {cameraOpen && isVideoReady && selectedFilter !== "clear" && (
              <div
                aria-hidden="true"
                className={`camera-frame camera-frame-${selectedFilter} pointer-events-none absolute inset-0`}
              >
                {selectedFilter === "golden-glow" && (
                  <span className="camera-sparkles" />
                )}
                {selectedFilter === "diya-dreams" && (
                  <span className="camera-diya-row" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((item) => <i key={item} />)}
                  </span>
                )}
                {selectedFilter === "royal-diwali" && (
                  <span className="camera-royal-corners" />
                )}
                {selectedFilter === "marigold-magic" && (
                  <span className="camera-marigold-garland" />
                )}
                {selectedFilter === "fireworks-night" && (
                  <span className="camera-firework-bursts" />
                )}
                {selectedFilter === "rangoli-frame" && (
                  <span className="camera-rangoli-corners" />
                )}
                {selectedFilter === "peacock-festive" && (
                  <span className="camera-peacock-corners" />
                )}
              </div>
            )}
            {(!cameraOpen || !isVideoReady) && (
              <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,191,91,0.25),_rgba(18,1,13,0.95)_50%)] p-4 text-center sm:p-6">
                <div className="max-w-md space-y-3 sm:space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold sm:h-16 sm:w-16">
                    {isLoading ? <LoaderCircle size={28} className="animate-spin" /> : <Camera size={28} />}
                  </div>
                  <p className="text-xl font-display leading-tight text-gold sm:text-2xl">
                    {isLoading ? "Connecting to your camera…" : "Open the camera to capture a festive moment."}
                  </p>
                  <p className="text-xs leading-5 text-amber-100/75 sm:text-sm">
                    Your browser will ask before camera access begins. Photos are processed only in your browser and are never uploaded automatically. Camera access requires HTTPS, except on localhost.
                  </p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <p role="alert" className="mt-4 rounded-2xl border border-red-300/40 bg-red-950/60 p-3 text-sm text-red-100">
              {error}
            </p>
          )}
          {notice && (
            <p role="status" className="mt-4 rounded-2xl border border-gold/30 bg-gold/10 p-3 text-sm text-amber-100">
              {notice}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className="btn-gold" onClick={() => void toggleCamera()}>
              {cameraOpen || isLoading ? <CameraOff size={16} /> : <Camera size={16} />}
              {cameraOpen || isLoading ? "Camera Off" : "Open Camera"}
            </button>
            {cameraOpen && !isLoading && (
              <button type="button" className="btn-ghost" onClick={() => void switchCamera()}>
                <RefreshCcw size={16} />
                Switch Camera
              </button>
            )}
            {cameraOpen && !isLoading && (
              <button type="button" className="btn-ghost" onClick={capturePhoto}>
                <Sparkles size={16} />
                Capture
              </button>
            )}
          </div>
        </div>

        <div className="min-w-0 space-y-5">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold/80">Festive filters</p>
            <div
              aria-label="Camera filters"
              className="-mx-1 flex w-full max-w-full snap-x gap-2 overflow-x-auto px-1 pb-2"
            >
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={selectedFilter === filter.id}
                  onClick={() => {
                    filterIdRef.current = filter.id;
                    setSelectedFilter(filter.id);
                    setPhotoData(null);
                  }}
                  className={`w-28 shrink-0 snap-start rounded-2xl border px-3 py-2 text-left text-xs transition-all duration-300 sm:w-32 ${
                    selectedFilter === filter.id
                      ? "border-gold bg-gold/15 text-gold"
                      : "border-white/10 bg-white/5 text-amber-100/80 hover:border-gold/55"
                  }`}
                >
                  <span className={`camera-filter-swatch camera-frame camera-frame-${filter.id} mb-2 block h-10 rounded-lg transition-transform duration-300 ${selectedFilter === filter.id ? "scale-[1.03]" : ""}`} />
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {photoData && (
            <div className="festive-card rounded-[2rem] p-4">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold/80">Captured photo · {FILTERS.find((filter) => filter.id === selectedFilter)?.label}</p>
              <Image
                src={photoData}
                alt="Captured Diwali photo with the selected festive filter"
                width={1280}
                height={720}
                unoptimized
                className="h-56 w-full rounded-[1.2rem] object-cover"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" className="btn-gold" onClick={downloadPhoto}>
                  <Download size={16} />
                  Download PNG
                </button>
                <button type="button" className="btn-ghost" onClick={() => void sharePhoto()}>
                  <Share2 size={16} />
                  Share
                </button>
                {cameraOpen && (
                  <button type="button" className="btn-ghost" onClick={() => setPhotoData(null)}>
                    <RefreshCcw size={16} />
                    Retake
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
