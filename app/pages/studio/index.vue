<template>
  <div class="mt-3 border mx-auto w-[85rem] h-[85vh]">
    <div class="m-3 grid grid-cols-7 gap-4">
      <div class="border col-span-3">
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
import { onMounted, ref, watch } from "vue";
import Oscillator from "~/components/Oscillator.vue";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
