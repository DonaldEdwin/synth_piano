<template>
  <div
    class="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[fit-content] py-3 border border-white/10 bg-black rounded-2xl"
  >
    <div class="flex items-center gap-4 px-6">
      <NuxtLink
        class="p-1"
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
      >
        <TooltipProvider :delay-duration="0">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                :variant="route.path === link.path ? 'secondary' : 'ghost'"
                class="rounded-xl transition-all duration-300 flex items-center justify-center !p-0 !w-13 !h-9"
                :class="
                  route.path === link.path
                    ? 'scale-125'
                    : 'text-gray-400 hover:text-white'
                "
              >
                <component :is="link.icon" class="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{{ link.name }}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Home, Music, User, Wand2 } from "lucide-vue-next";

const route = useRoute();

const navLinks = [
  { name: "Home", path: "/", icon: Home },
  { name: "Studio", path: "/studio", icon: Wand2 },
  { name: "Library", path: "/library", icon: Music },
  { name: "Profile", path: "/profile", icon: User },
];
</script>
