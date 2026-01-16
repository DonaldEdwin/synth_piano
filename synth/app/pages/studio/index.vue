<template>
  <div class="mt-3 border mx-auto w-[85rem] h-[85vh]">
    <div class="m-3 grid grid-cols-7 gap-4 h-full">
      <div class="border col-span-3 overflow-y-auto">
        <div class="m-4 space-y-2">
          <div class="p-4">
            <Oscillator v-model="oscType" />
          </div>

          <label class="block">
            Reverb: {{ reverbAmount.toFixed(2) }}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              v-model.number="reverbAmount"
            />
          </label>

          <label class="block">
            Chorus: {{ chorusAmount.toFixed(2) }}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              v-model.number="chorusAmount"
            />
          </label>

          <label class="block">
            Delay: {{ delayAmount.toFixed(2) }}
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.01"
              v-model.number="delayAmount"
            />
          </label>

          <Separator class="my-4" />

          <div class="mt-6">
            <h3 class="font-semibold text-sm mb-3">Your Audios</h3>
            <div class="space-y-2">
              <div
                v-for="audio in userAudios"
                :key="audio.id"
                class="p-2 border rounded hover:bg-secondary cursor-pointer text-sm flex justify-between items-center gap-2"
              >
                <div class="flex-1 truncate">
                  <p class="font-medium truncate">{{ audio.title }}</p>
                  <audio
                    :key="`audio-${audio.id}`"
                    :src="audio.file_path"
                    controls
                    class="w-full mt-1"
                  />
                </div>
                <Button
                  @click="deleteAudio(audio.id)"
                  size="sm"
                  variant="destructive"
                  class="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
              <p v-if="userAudios.length === 0" class="text-xs text-muted-foreground py-2">
                No audios yet
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="border col-span-4">
        <div class="border border-primary m-3 h-[15rem] relative">
          <!-- white keys -->
          <div class="grid grid-cols-10 gap-2">
            <div
              v-for="key in whiteKeys"
              :key="key.note"
              class="border h-[11rem] flex items-end justify-center"
              :class="{ 'bg-secondary': pressedKeys.has(key.note) }"
            >
              {{ key.note }}
            </div>
          </div>

          <!-- Black keys -->
          <div class="absolute top-0 left-0 right-0 h-[8rem] grid grid-cols-10">
            <div v-for="(whiteKey, index) in whiteKeys" :key="'pos-' + index">
              <div
                v-if="whiteKey.hasBlackAfter"
                class="border bg-[#0a1a20] w-[80%] h-full ml-[-40%] flex items-end justify-center"
                :class="{
                  'bg-secondary': pressedKeys.has(
                    getBlackKeyForWhiteIndex(index)?.note
                  ),
                }"
              >
                {{ getBlackKeyForWhiteIndex(index)?.note }}
              </div>
            </div>
          </div>
        </div>
        <div class="border border-primary m-3 h-[10rem] relative">
          <div class="grid grid-cols-2">
            <div class="p-4">
              <p>Keyboard Controls</p>
              <br />
              <p>white keys: -S D - G H J - L ;</p>
              <p>Black keys: Z X C V B N M , . /</p>
            </div>
            <div>
              <div class="p-6">
                <RadioGroup default-value="play">
                  <div class="flex items-center space-x-2">
                    <RadioGroupItem
                      id="r1"
                      @click="startRecording"
                      value="record"
                    />
                    <Label for="r1">Record</Label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <RadioGroupItem
                      id="r2"
                      @click="stopRecording"
                      value="stop"
                    />
                    <Label for="r2">Stop</Label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <RadioGroupItem
                      id="r3"
                      @click="playRecording"
                      :disabled="!recording"
                      value="play"
                    />
                    <Label for="r3">play</Label>
                  </div>
                </RadioGroup>
              </div>
              <div class="mt-2 space-y-2">
  <input
    v-model="title"
    placeholder="Audio title"
    class="border px-2 py-1 w-full"
  />
  <button
    @click="saveRecording"
    :disabled="!recording"
    class="px-4 py-2 bg-primary text-white rounded"
  >
    Save
  </button>
</div>
            </div>
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

onMounted(() => {});
let synth;
let recorder;
let reverb;
let delay;
let chorus;

const oscType = ref("");

//effects

const reverbAmount = ref(0.0);
const delayAmount = ref(0.0);
const chorusAmount = ref(0.0);

const title = ref("");
const audioStore = useAudioStore();
const authStore = useAuthStore();

const userAudios = computed(() => {
  return audioStore.audios.filter(audio => audio.user_id === authStore.user?.id);
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

const getBlackKeyForWhiteIndex = (index) => {
  return blackKeys.value.find((bk) => bk.whiteKeyIndex === index);
};

const whiteKeys = ref([
  { note: "C4", keyCode: "Z", hasBlackAfter: false },
  { note: "D4", keyCode: "X", hasBlackAfter: true },
  { note: "E4", keyCode: "C", hasBlackAfter: true },
  { note: "F4", keyCode: "V", hasBlackAfter: false },
  { note: "G4", keyCode: "B", hasBlackAfter: true },
  { note: "A4", keyCode: "N", hasBlackAfter: true },
  { note: "B4", keyCode: "M", hasBlackAfter: true },
  { note: "C5", keyCode: ",", hasBlackAfter: false },
  { note: "D5", keyCode: ".", hasBlackAfter: true },
  { note: "E5", keyCode: "/", hasBlackAfter: true },
]);

const blackKeys = ref([
  { note: "C#4", keyCode: "S", whiteKeyIndex: 1 },
  { note: "D#4", keyCode: "D", whiteKeyIndex: 2 },
  { note: "F#4", keyCode: "G", whiteKeyIndex: 4 },
  { note: "G#4", keyCode: "H", whiteKeyIndex: 5 },
  { note: "A#4", keyCode: "J", whiteKeyIndex: 6 },
  { note: "C#5", keyCode: "K", whiteKeyIndex: 8 },
  { note: "D#5", keyCode: "", whiteKeyIndex: 9 },
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

onMounted(() => {
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
  console.log("Recorded blob:", blob);
};

const playRecording = () => {
  if (!recording.value) return;
  const url = URL.createObjectURL(recording.value);
  const audio = new Audio(url);
  audio.play();
};
</script>
