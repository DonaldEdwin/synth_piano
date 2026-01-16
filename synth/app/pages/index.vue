<template>
  <div class="min-h-[85vh] bg-gradient-to-b from-background to-secondary/20">
    <!-- Hero Section -->
    <div class="relative overflow-hidden py-20 px-6">
      <div class="max-w-5xl mx-auto">
        <!-- Gradient background elements -->
        <div
          class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        ></div>
        <div
          class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
        ></div>

        <!-- Hero Content -->
        <div class="relative z-10 text-center space-y-6">
          <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-4"
          >
            <span class="text-sm font-medium">Web-Based Audio Creation</span>
          </div>

          <h1 class="text-5xl md:text-6xl font-bold tracking-tight">
            Create Music in Your Browser
          </h1>

          <p
            class="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            A collaborative web-based synthesizer studio that combines intuitive
            piano controls with professional audio effects. Record, share, and
            discover audio creations in a vibrant community.
          </p>

          <!-- CTA Buttons -->
          <div
            class="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
          >
            <NuxtLink to="/studio">
              <Button size="lg" class="bg-primary hover:bg-primary/90 px-8">
                Enter Studio
              </Button>
            </NuxtLink>
            <NuxtLink to="/library">
              <Button size="lg" variant="outline" class="px-8">
                Browse Library
              </Button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-20 px-6 bg-secondary/30">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">
          Powerful Features for Modern Music Creation
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Feature 1 -->
          <Card
            class="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/50 transition-all"
          >
            <CardContent class="pt-6">
              <h3 class="font-semibold mb-2">Interactive Piano</h3>
              <p class="text-sm text-muted-foreground">
                Full 88-key weighted piano with white and black keys. Play with
                your keyboard or mouse for an intuitive experience.
              </p>
            </CardContent>
          </Card>

          <!-- Feature 2 -->
          <Card
            class="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/50 transition-all"
          >
            <CardContent class="pt-6">
              <h3 class="font-semibold mb-2">Advanced Effects</h3>
              <p class="text-sm text-muted-foreground">
                Reverb, chorus, and delay effects with real-time control. Choose
                from multiple oscillator types: sine, square, sawtooth, and
                triangle.
              </p>
            </CardContent>
          </Card>

          <!-- Feature 3 -->
          <Card
            class="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/50 transition-all"
          >
            <CardContent class="pt-6">
              <h3 class="font-semibold mb-2">Record & Share</h3>
              <p class="text-sm text-muted-foreground">
                Record your sessions directly in the browser and share with the
                community. All recordings are stored in high quality.
              </p>
            </CardContent>
          </Card>

          <!-- Feature 4 -->
          <Card
            class="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/50 transition-all"
          >
            <CardContent class="pt-6">
              <h3 class="font-semibold mb-2">Community Feedback</h3>
              <p class="text-sm text-muted-foreground">
                Engage with other musicians through comments and discussions.
                Get feedback on your creations and discover new techniques.
              </p>
            </CardContent>
          </Card>

          <!-- Feature 5 -->
          <Card
            class="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/50 transition-all"
          >
            <CardContent class="pt-6">
              <h3 class="font-semibold mb-2">Audio Library</h3>
              <p class="text-sm text-muted-foreground">
                Explore a growing library of user-created audio. Browse by
                artist, date, or trending creations to find inspiration.
              </p>
            </CardContent>
          </Card>

          <!-- Feature 6 -->
          <Card
            class="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/50 transition-all"
          >
            <CardContent class="pt-6">
              <h3 class="font-semibold mb-2">Real-Time Audio</h3>
              <p class="text-sm text-muted-foreground">
                Powered by Tone.js, experience zero-latency audio synthesis.
                Professional-grade sound quality in your browser.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <!-- Tech Stack Section -->
    <div class="py-20 px-6">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">Modern Tech Stack</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
              Frontend
            </h3>
            <ul class="space-y-2 text-muted-foreground">
              <li class="flex items-center gap-2">
                <span class="text-primary">✓</span> Vue 3 + Nuxt 4
              </li>
              <li class="flex items-center gap-2">
                <span class="text-primary">✓</span> Tailwind CSS
              </li>
              <li class="flex items-center gap-2">
                <span class="text-primary">✓</span> Tone.js for audio synthesis
              </li>
              <li class="flex items-center gap-2">
                <span class="text-primary">✓</span> Pinia state management
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
              Backend
            </h3>
            <ul class="space-y-2 text-muted-foreground">
              <li class="flex items-center gap-2">
                <span class="text-primary">✓</span> Node.js + Express
              </li>
              <li class="flex items-center gap-2">
                <span class="text-primary">✓</span> MySQL database
              </li>
              <li class="flex items-center gap-2">
                <span class="text-primary">✓</span> JWT authentication
              </li>
              <li class="flex items-center gap-2">
                <span class="text-primary">✓</span> RESTful API design
              </li>
            </ul>
          </div>
        </div>

        <!-- Docker -->
        <div class="mt-8 p-6 rounded-lg border border-primary/20 bg-primary/5">
          <h3 class="text-lg font-semibold mb-2 flex items-center gap-2">
            Infrastructure
          </h3>
          <p class="text-muted-foreground">
            Containerized with Docker and Docker Compose for seamless deployment
            and development consistency.
          </p>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div
      class="py-20 px-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-y border-primary/10"
    >
      <div class="max-w-2xl mx-auto text-center space-y-6">
        <h2 class="text-3xl font-bold">Ready to Create?</h2>
        <p class="text-lg text-muted-foreground">
          Start making music right now. No downloads, no installation. Just pure
          audio creativity in your browser.
        </p>
        <NuxtLink to="/studio">
          <Button size="lg" class="bg-primary hover:bg-primary/90 px-8">
            Launch Studio →
          </Button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
</script>
