"use client";

import { useCallback, useRef } from "react";

const POP_SOUND =
  "data:audio/wav;base64,UklGRl4AAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YToAAAAFABEAGgAdABsAFAAKAAEA+f/0//L/8v/1//r/AAAGAA0AEgAVABUAEgANAAYA//8=";
const LIKE_SOUND =
  "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVYGAACAgICAgICAgICAgICAgICAgICAgICAgIGBgYGBgYGBgYGBgYGBgYGBgYGBgYKCgoKCgoKCgoKCgoKCgoKCgoKCgoKDg4ODg4ODg4ODg4ODg4ODg4ODg4ODhISEhISEhISEhISEhISEhISEhISEhIWFhYWFhYWFhYWFhYWFhYWFhYWFhYWGhoaGhoaGhoaGhoaGhoaGhoaGhoaGh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4iIiIiIiIiIiIiIiIiIiIiIiIiIiIiJiYmJiYmJiYmJiYmJiYmJiYmJiYmJioqKioqKioqKioqKioqKioqKioqKi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4yMjIyMjIyMjIyMjIyMjIyMjIyMjIyNjY2NjY2NjY2NjY2NjY2NjY2NjY2Njo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Oj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+PkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJGRkZGRkZGRkZGRkZGRkZGRkZGRkZKSkpKSkpKSkpKSkpKSkpKSkpKSkpOTk5OTk5OTk5OTk5OTk5OTk5OTk5SUlJSUlJSUlJSUlJSUlJSUlJSUlJWVlZWVlZWVlZWVlZWVlZWVlZWVlZaWlpaWlpaWlpaWlpaWlpaWlpaWlpeXl5eXl5eXl5eXl5eXl5eXl5eXl5eYmJiYmJiYmJiYmJiYmJiYmJiYmJiZmZmZmZmZmZmZmZmZmZmZmZmZmZmampqampqampqampqampqampqampqam5ubm5ubm5ubm5ubm5ubm5ubm5ubnJycnJycnJycnJycnJycnJycnJycnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnp6enp6enp6enp6enp6enp6enp6en5+fn5+fn5+fn5+fn5+fn5+fn5+foKCgoKCgoKCgoKCgoKCgoKCgoKCgoaGhoaGhoaGhoaGhoaGhoaGhoaGhoqKioqKioqKioqKioqKioqKioqKio6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OjpKSkpKSkpKSkpKSkpKSkpKSkpKSkpaWlpaWlpaWlpaWlpaWlpaWlpaWlpqampqampqampqampqampqampqamqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqurq6urq6urq6urq6urq6urq6urq6ura2tra2tra2tra2tra2tra2tra2trawsLCwsLCwsLCwsLCwsLCwsLCwsLCxsbGxsbGxsbGxsbGxsbGxsbGxsbGysrKysrKysrKysrKysrKysrKysrKzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLS0tLS0tLS0tLS0tLS0tLS0tLS0tbW1tbW1tbW1tbW1tbW1tbW1tbW1tra2tra2tra2tra2tra2tra2tra2tre3t7e3t7e3t7e3t7e3t7e3t7e3t7e4uLi4uLi4uLi4uLi4uLi4uLi4uLi5ubm5ubm5ubm5ubm5ubm5ubm5ubm6urq6urq6urq6urq6urq6urq6urq7u7u7u7u7u7u7u7u7u7u7u7u7u7y8vLy8vLy8vLy8vLy8vLy8vLy8vL29vb29vb29vb29vb29vb29vb29vb6+vr6+vr6+vr6+vr6+vr6+vr6+vr+/v7+/v7+/v7+/v7+/v7+/v7+/v8DAwMDAwMDAwMDAwMDAwMDAwMDAwMHBwcHBwcHBwcHBwcHBwcHBwcHBwcLCwsLCwsLCwsLCwsLCwsLCwsLCwsPDw8PDw8PDw8PDw8PDw8PDw8PDw8TExMTExMTExMTExMTExMTExMTExMXFxcXFxcXFxcXFxcXFxcXFxcXFxcbGxsbGxsbGxsbGxsbGxsbGxsbGxsfHx8fHx8fHx8fHx8fHx8fHx8fHx8jIyMjIyMjIyMjIyMjIyMjIyMjIyMnJycnJycnJycnJycnJycnJycnJycrKysrKysrKysrKysrKysrKysrKysvLy8vLy8vLy8vLy8vLy8vLy8vLy8zMzMzMzMzMzMzMzMzMzMzMzMzMzM3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/P0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDR0dHR0dHR0dHR0dHR0dHR0dHR0dLS0tLS0tLS0tLS0tLS0tLS0tLS09PT09PT09PT09PT09PT09PT09PT1NTU1NTU1NTU1NTU1NTU1NTU1NTU";

export const useSoundEffect = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null; // Safe check for SSR

    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }
    return audioContextRef.current;
  }, []);

  const playPop = useCallback(() => {
    try {
      const audio = new Audio(POP_SOUND);
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (e) {}
  }, []);

  const playLike = useCallback(() => {
    try {
      const audio = new Audio(LIKE_SOUND);
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } catch (e) {}
  }, []);

  const playSynthPop = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }, [getAudioContext]);

  const playCelebration = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.type = "sine";

        const startTime = ctx.currentTime + i * 0.03;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch (e) {}
  }, [getAudioContext]);

  return {
    playPop,
    playLike,
    playSynthPop,
    playCelebration,
  };
};

export default useSoundEffect;
