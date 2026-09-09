"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type AudioState = "idle" | "playing" | "paused";

interface AudioContextWindow extends Window {
  AudioContext: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
}

/**
 * Procedurally-generated ambient space music using Web Audio API.
 * Layered sine + triangle oscillators with slow LFO modulations
 * and a reverb-style delay for that "cosmic" feel.
 */
export function AmbientMusicPlayer() {
  const [state, setState] = useState<AudioState>("idle");
  const [volume, setVolume] = useState(0.5);
  const [showControls, setShowControls] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const lfosRef = useRef<OscillatorNode[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize the audio graph (procedural ambient music)
  const initAudio = () => {
    if (audioCtxRef.current) return;
    const AudioCtx =
      (window as AudioContextWindow).AudioContext ||
      (window as AudioContextWindow).webkitAudioContext;
    if (!AudioCtx) {
      toast.error("Web Audio not supported in this browser");
      return;
    }
    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;

    // Master gain (controls volume)
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    masterGainRef.current = master;

    // Delay (reverb-style) for cosmic ambience
    const delay = ctx.createDelay(2);
    delay.delayTime.value = 0.7;
    const delayGain = ctx.createGain();
    delayGain.gain.value = 0.35;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.45;
    delay.connect(delayGain);
    delayGain.connect(feedback);
    feedback.connect(delay);
    delayGain.connect(master);

    // Soft lowpass filter for warmth
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2200;
    filter.Q.value = 0.6;
    filter.connect(master);
    filter.connect(delay);

    // === Drone notes (very soft, slow-evolving) ===
    // Root: D2 (~73.42 Hz), with harmonics
    const droneFreqs = [73.42, 110.0, 146.83, 220.0, 293.66]; // D2, A2, D3, A3, D4
    const droneTypes: OscillatorType[] = ["sine", "sine", "triangle", "sine", "triangle"];
    const droneGains = [0.18, 0.12, 0.10, 0.06, 0.04];

    droneFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = droneTypes[i];
      osc.frequency.value = freq;

      const oscGain = ctx.createGain();
      oscGain.gain.value = droneGains[i];

      // LFO for slow volume modulation (per oscillator)
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05 + i * 0.02; // very slow, different per osc
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = droneGains[i] * 0.4; // 40% modulation depth
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);

      // LFO for subtle pitch modulation (chorus-like)
      const pitchLfo = ctx.createOscillator();
      pitchLfo.frequency.value = 0.1 + i * 0.03;
      const pitchLfoGain = ctx.createGain();
      pitchLfoGain.gain.value = 0.5; // cents
      pitchLfo.connect(pitchLfoGain);
      pitchLfoGain.connect(osc.frequency);

      osc.connect(oscGain);
      oscGain.connect(filter);

      osc.start();
      lfo.start();
      pitchLfo.start();
      oscillatorsRef.current.push(osc);
      lfosRef.current.push(lfo);
      lfosRef.current.push(pitchLfo);
    });

    // === Sparkle / twinkle (random high notes via scheduled events) ===
    const sparkleNotes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6
    const scheduleSparkle = () => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = sparkleNotes[Math.floor(Math.random() * sparkleNotes.length)];

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(0.05, now + 0.5); // slow attack
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0); // slow decay

      osc.connect(oscGain);
      oscGain.connect(filter);
      oscGain.connect(delay);

      osc.start(now);
      osc.stop(now + 4.5);

      // Schedule next sparkle
      timeoutRef.current = setTimeout(scheduleSparkle, 8000 + Math.random() * 16000);
    };
    // First sparkle after a short delay
    timeoutRef.current = setTimeout(scheduleSparkle, 4000);
  };

  const play = async () => {
    initAudio();
    if (!audioCtxRef.current || !masterGainRef.current) return;
    if (audioCtxRef.current.state === "suspended") {
      await audioCtxRef.current.resume();
    }
    // Fade in
    masterGainRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
    masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, audioCtxRef.current.currentTime);
    masterGainRef.current.gain.linearRampToValueAtTime(volume, audioCtxRef.current.currentTime + 2);
    setState("playing");
  };

  const pause = () => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    // Fade out then suspend
    masterGainRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
    masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, audioCtxRef.current.currentTime);
    masterGainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 1);
    setTimeout(() => {
      audioCtxRef.current?.suspend();
    }, 1100);
    setState("paused");
  };

  const toggle = () => {
    if (state === "playing") pause();
    else play();
  };

  const changeVolume = (v: number) => {
    setVolume(v);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(v, audioCtxRef.current.currentTime);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      oscillatorsRef.current.forEach((o) => o.stop());
      lfosRef.current.forEach((l) => l.stop());
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[60] pointer-events-auto">
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-56 glass-strong rounded-xl p-3 space-y-3"
          >
            <div className="flex items-center gap-2">
              <Music className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">Cosmic Ambient</span>
              <div className="ml-auto flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-muted-foreground">
                  {state === "playing" ? "Live" : state === "paused" ? "Paused" : "Idle"}
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => changeVolume(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
            <div className="text-[10px] text-muted-foreground pt-1 border-t border-white/5">
              Procedurally generated · infinite ambient soundtrack
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (state === "idle") {
            play();
            toast.success("Cosmic ambient music on", {
              description: "Soft procedural soundtrack playing in background",
            });
          } else {
            toggle();
          }
        }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setTimeout(() => setShowControls(false), 1500)}
        className={cn(
          "h-10 w-10 rounded-full glass-strong flex items-center justify-center transition-all",
          state === "playing" && "glow-primary"
        )}
        aria-label={state === "playing" ? "Pause music" : "Play ambient music"}
      >
        {/* Animated equalizer when playing */}
        {state === "playing" ? (
          <div className="flex items-end gap-0.5 h-4">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-0.5 bg-primary rounded-full"
                animate={{ height: [4, 12, 6, 14, 4] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        ) : (
          <>
            {state === "idle" ? (
              <Music className="h-4 w-4 text-primary" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
          </>
        )}
      </motion.button>
    </div>
  );
}
