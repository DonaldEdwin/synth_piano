<template>
  <div class="mt-3 border mx-auto w-full h-[85vh] bg-background">
    <div class="m-3 grid grid-cols-7 gap-4 h-full">
      <!-- Left Sidebar -->
      <div
        class="border border-primary/30 col-span-3 overflow-y-auto rounded-lg bg-card/50"
      >
        <div class="m-4 space-y-4">
          <!-- Oscillator -->
          <div class="p-4 border border-primary/20 rounded-lg bg-secondary/30">
            <Oscillator v-model="oscType" />
          </div>

          <!-- Reverb Slider -->
          <div
            class="space-y-2 p-3 border border-primary/20 rounded-lg bg-secondary/30"
          >
            <label class="block">
              <span class="text-sm font-semibold"
                >Reverb: {{ reverbAmount.toFixed(2) }}</span
              >
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                v-model.number="reverbAmount"
                class="w-full mt-2 cursor-pointer"
              />
            </label>
          </div>

          <!-- Chorus Slider -->
          <div
            class="space-y-2 p-3 border border-primary/20 rounded-lg bg-secondary/30"
          >
            <label class="block">
              <span class="text-sm font-semibold"
                >Chorus: {{ chorusAmount.toFixed(2) }}</span
              >
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                v-model.number="chorusAmount"
                class="w-full mt-2 cursor-pointer"
              />
            </label>
          </div>

          <!-- Delay Slider -->
          <div
            class="space-y-2 p-3 border border-primary/20 rounded-lg bg-secondary/30"
          >
            <label class="block">
              <span class="text-sm font-semibold"
                >Delay: {{ delayAmount.toFixed(2) }}</span
              >
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.01"
                v-model.number="delayAmount"
                class="w-full mt-2 cursor-pointer"
              />
            </label>
          </div>

          <Separator class="my-4" />

          <!-- Your Audios Section -->
          <div class="mt-6">
            <h3 class="font-semibold text-sm mb-3">
              Your Audios ({{ userAudios.length }})
            </h3>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div
                v-for="audio in userAudios"
                :key="audio.id"
                class="p-3 border border-primary/20 rounded hover:bg-secondary/50 cursor-pointer text-sm flex flex-col gap-2 bg-secondary/20 transition-colors"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <p class="font-medium truncate">{{ audio.title }}</p>
                    <p class="text-xs text-muted-foreground">
                      {{ new Date(audio.created_at).toLocaleDateString() }}
                    </p>
                  </div>
                  <Button
                    @click="deleteAudio(audio.id)"
                    size="sm"
                    variant="destructive"
                    class="h-6 w-6 p-0 flex-shrink-0"
                  >
                    ×
                  </Button>
                </div>
                <audio
                  :key="`audio-${audio.id}`"
                  :src="`http://localhost:3001${audio.file_path}`"
                  controls
                  class="w-full h-6 text-xs"
                />
              </div>
              <p
                v-if="userAudios.length === 0"
                class="text-xs text-muted-foreground py-4 text-center"
              >
                No audios yet. Start recording!
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Content Area -->
      <div
        class="border border-primary/30 col-span-4 rounded-lg bg-card/50 overflow-hidden flex flex-col"
      >
        <!-- Piano Section -->
        <div class="flex-1 border-b border-primary/30 m-3 overflow-auto">
          <div
            class="border border-primary rounded-lg p-6 bg-black h-full flex items-center justify-center"
          >
            <!-- Piano Container -->
            <div class="relative" style="width: 100%; max-width: 900px">
              <!-- White Keys Container -->
              <div
                class="flex gap-0 justify-start relative bg-gradient-to-b from-white to-gray-200 p-2 rounded"
              >
                <!-- White Keys -->
                <div
                  v-for="key in whiteKeys"
                  :key="key.note"
                  class="relative flex-1 border-2 border-gray-400 bg-gradient-to-b from-white to-gray-100 h-48 flex items-end justify-center cursor-pointer transition-all rounded-b shadow-lg hover:shadow-xl"
                  :class="{
                    'from-blue-200 to-blue-100': pressedKeys.has(key.note),
                  }"
                  style="min-width: 50px; margin-right: 2px"
                  @mousedown="
                    () => {
                      synth?.triggerAttack(key.note);
                      pressedKeys.add(key.note);
                    }
                  "
                  @mouseup="
                    () => {
                      synth?.triggerRelease(key.note);
                      pressedKeys.delete(key.note);
                    }
                  "
                  @mouseleave="
                    () => {
                      synth?.triggerRelease(key.note);
                      pressedKeys.delete(key.note);
                    }
                  "
                >
                  <span class="text-xs font-bold text-gray-700 pb-4">{{
                    key.note
                  }}</span>
                </div>
              </div>

              <!-- Black Keys Overlay -->
              <div
                class="absolute top-0 left-0 right-0 h-32 pointer-events-none flex justify-start gap-0 pl-2"
              >
                <div
                  v-for="(whiteKey, index) in whiteKeys"
                  :key="'black-' + index"
                  class="flex-1 relative"
                  style="min-width: 50px; margin-right: 2px"
                >
                  <div
                    v-if="whiteKey.hasBlackAfter"
                    class="absolute right-0 top-0 -mr-3 w-10 h-28 bg-gradient-to-b from-gray-800 to-black border-2 border-black rounded-b flex items-end justify-center cursor-pointer transition-all shadow-2xl hover:shadow-xl"
                    :class="{
                      'from-gray-600 to-gray-700': pressedKeys.has(
                        getBlackKeyNote(index)
                      ),
                    }"
                    style="pointer-events: auto; z-index: 10"
                    @mousedown="playBlackKey(index)"
                    @mouseup="releaseBlackKey(index)"
                    @mouseleave="releaseBlackKey(index)"
                  >
                    <span class="text-white text-xs font-bold pb-2">{{
                      getBlackKeyNote(index)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Controls Section -->
        <div class="border-t border-primary/30 m-3 space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <!-- Recording Controls -->
            <div class="space-y-3">
              <p class="text-sm font-semibold mb-2">Keyboard Controls</p>
              <div class="text-xs text-muted-foreground space-y-1">
                <p>
                  <span class="font-medium">White:</span> Z X C V B N M , . /
                </p>
                <p><span class="font-medium">Black:</span> S D G H J K</p>
              </div>
            </div>

            <!-- Recording Actions -->
            <div class="space-y-3">
              <RadioGroup default-value="play">
                <div class="flex items-center space-x-2">
                  <RadioGroupItem
                    id="r1"
                    @click="startRecording"
                    value="record"
                  />
                  <Label for="r1" class="cursor-pointer">Record</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <RadioGroupItem id="r2" @click="stopRecording" value="stop" />
                  <Label for="r2" class="cursor-pointer">Stop</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <RadioGroupItem
                    id="r3"
                    @click="playRecording"
                    :disabled="!recording"
                    value="play"
                  />
                  <Label for="r3" class="cursor-pointer">Play</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <!-- Save Recording -->
          <div class="space-y-2 pt-2 border-t border-primary/30">
            <input
              v-model="title"
              placeholder="Audio title..."
              class="border border-primary/30 px-3 py-2 w-full rounded-lg bg-secondary/30 text-sm"
            />
            <button
              @click="saveRecording"
              :disabled="!recording"
              class="px-4 py-2 w-full bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Save Recording
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as Tone from "tone";
import AudioKeys from "audiokeys";
import { onMounted, ref, watch, computed } from "vue";
import Oscillator from "~/components/Oscillator.vue";
import { useAudioStore } from "@/stores/audio";
import { useAuthStore } from "@/stores/auth";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { apiDelete } from "@/utils/api";

let synth;
let recorder;
let reverb;
let delay;
let chorus;

const oscType = ref("");
const reverbAmount = ref(0.0);
const delayAmount = ref(0.0);
const chorusAmount = ref(0.0);
const title = ref("");

const audioStore = useAudioStore();
const authStore = useAuthStore();

const userAudios = computed(() => {
  return audioStore.audios.filter(
    (audio) => audio.user_id === authStore.user?.id
  );
});

const saveRecording = async () => {
  if (!recording.value) return;
  if (!title.value.trim()) {
    alert("Enter a title");
    return;
  }

  const file = new File([recording.value], "recording.wav", {
    type: "audio/wav",
  });

  const form = new FormData();
  form.append("audio", file);
  form.append("title", title.value);

  await audioStore.uploadAudio(form);

  title.value = "";
  recording.value = null;
};

const deleteAudio = async (audioId) => {
  if (!confirm("Delete this audio?")) return;
  const token = localStorage.getItem("token");
  const response = await apiDelete(`/audios/${audioId}`, token);
  if (response.success) {
    await audioStore.fetchAudios();
  }
};

watch(reverbAmount, (v) => {
  if (reverb) reverb.wet.value = v;
});

watch(delayAmount, (v) => {
  if (delay) delay.wet.value = v;
});

watch(chorusAmount, (v) => {
  if (chorus) chorus.wet.value = v;
});

watch(oscType, (type) => {
  if (synth) {
    synth.set({ oscillator: { type } });
  }
});

const getBlackKeyNote = (index) => {
  const blackKey = blackKeys.value.find((bk) => bk.whiteKeyIndex === index);
  return blackKey?.note;
};

const playBlackKey = (index) => {
  const note = getBlackKeyNote(index);
  if (note) {
    synth?.triggerAttack(note);
    pressedKeys.value.add(note);
  }
};

const releaseBlackKey = (index) => {
  const note = getBlackKeyNote(index);
  if (note) {
    synth?.triggerRelease(note);
    pressedKeys.value.delete(note);
  }
};

const whiteKeys = ref([
  { note: "C4", keyCode: "Z", hasBlackAfter: true },
  { note: "D4", keyCode: "X", hasBlackAfter: true },
  { note: "E4", keyCode: "C", hasBlackAfter: false },
  { note: "F4", keyCode: "V", hasBlackAfter: true },
  { note: "G4", keyCode: "B", hasBlackAfter: true },
  { note: "A4", keyCode: "N", hasBlackAfter: true },
  { note: "B4", keyCode: "M", hasBlackAfter: false },
  { note: "C5", keyCode: ",", hasBlackAfter: true },
  { note: "D5", keyCode: ".", hasBlackAfter: true },
  { note: "E5", keyCode: "/", hasBlackAfter: false },
]);

const blackKeys = ref([
  { note: "C#4", keyCode: "S", whiteKeyIndex: 0 },
  { note: "D#4", keyCode: "D", whiteKeyIndex: 1 },
  { note: "F#4", keyCode: "G", whiteKeyIndex: 3 },
  { note: "G#4", keyCode: "H", whiteKeyIndex: 4 },
  { note: "A#4", keyCode: "J", whiteKeyIndex: 5 },
  { note: "C#5", keyCode: "K", whiteKeyIndex: 7 },
  { note: "D#5", keyCode: "", whiteKeyIndex: 8 },
]);

const midiToNote = {
  60: "C4",
  61: "C#4",
  62: "D4",
  63: "D#4",
  64: "E4",
  65: "F4",
  66: "F#4",
  67: "G4",
  68: "G#4",
  69: "A4",
  70: "A#4",
  71: "B4",
  72: "C5",
  73: "C#5",
  74: "D5",
  75: "D#5",
  76: "E5",
};

const pressedKeys = ref(new Set());
const recording = ref(null);

onMounted(async () => {
  await audioStore.fetchAudios();

  const boot = async () => {
    window.removeEventListener("mousedown", boot);
    window.removeEventListener("keydown", boot);

    await Tone.start();

    reverb = new Tone.Reverb({
      decay: 3,
      wet: reverbAmount.value,
    });
    chorus = new Tone.Chorus({
      frequency: 1.5,
      delayTime: 3.5,
      depth: 0.7,
      type: "sine",
      spread: 180,
      wet: chorusAmount.value,
    }).start();

    delay = new Tone.FeedbackDelay({
      delayTime: "8n",
      feedback: 0.4,
      wet: delayAmount.value,
    });

    synth = new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 32,
      options: { oscillator: { type: oscType.value } },
    });

    synth.chain(chorus, reverb, delay, Tone.Destination);

    recorder = new Tone.Recorder();
    synth.connect(recorder);

    const keyboard = new AudioKeys({ rows: 2 });

    keyboard.down((key) => {
      const noteName = midiToNote[key.note];
      if (!noteName) return;
      if (pressedKeys.value.has(noteName)) return;

      pressedKeys.value.add(noteName);
      synth.triggerAttack(noteName);
    });

    keyboard.up((key) => {
      const noteName = midiToNote[key.note];
      if (!noteName) return;

      pressedKeys.value.delete(noteName);
      synth.triggerRelease(noteName);
    });
  };

  window.addEventListener("mousedown", boot, { once: true });
  window.addEventListener("keydown", boot, { once: true });
});

const startRecording = async () => {
  recording.value = null;
  await recorder.start();
};

const stopRecording = async () => {
  const blob = await recorder.stop();
  recording.value = blob;
};

const playRecording = () => {
  if (!recording.value) return;
  const url = URL.createObjectURL(recording.value);
  const audio = new Audio(url);
  audio.play();
};

definePageMeta({
  middleware: "auth",
});
</script>
