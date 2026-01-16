<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { ref } from "vue";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const email = ref("");
const password = ref("password");

const emit = defineEmits(["submit"]);

function onSubmit() {
  emit("submit", {
    email: email.value,
    password: password.value,
  });
}
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card class="overflow-hidden p-0">
      <CardContent class="grid p-0 md:grid-cols-2">
        <form @submit.prevent="onSubmit" class="p-6 md:p-8">
          <FieldGroup>
            <div class="flex flex-col items-center gap-2 text-center">
              <h1 class="text-2xl font-bold">Welcome back</h1>
              <p class="text-muted-foreground text-balance">
                Login to your synth account
              </p>
            </div>
            <Field>
              <FieldLabel for="email"> Email </FieldLabel>
              <Input
                v-model="email"
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </Field>
            <Field>
              <div class="flex items-center">
                <FieldLabel for="password"> Password </FieldLabel>
                <a
                  href="#"
                  class="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                v-model="password"
                id="password"
                type="password"
                required
              />
            </Field>
            <Field>
              <Button type="submit"> Login </Button>
            </Field>

            <FieldDescription class="text-center">
              Don't have an account?
              <a href="/auth/register"> Sign up </a>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  
  </div>
</template>
