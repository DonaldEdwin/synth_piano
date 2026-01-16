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

const emit = defineEmits(["submit"]);

const name = ref("");
const email = ref("");
const password = ref("");

function onSubmit() {
  emit("submit", {
    fullname: name.value,
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
              <h1 class="text-2xl font-bold">Create your account</h1>
              <p class="text-muted-foreground text-sm text-balance">
                Enter your email below to create your account
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
              <FieldDescription>
                We'll use this to contact you. We will not share your email with
                anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel for="name"> Name </FieldLabel>
              <Input
                v-model="name"
                id="name"
                type="name"
                placeholder="John Doe"
                required
              />
              <FieldDescription>
                We'll use this to contact you. We will not share your email with
                anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <Field class="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel for="password"> Password </FieldLabel>
                  <Input
                    v-model="password"
                    id="password"
                    type="password"
                    required
                  />
                </Field>
              </Field>
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <Button type="submit"> Create Account </Button>
            </Field>
         
          
            <FieldDescription class="text-center">
              Already have an account? <a href="/auth/login">Sign in</a>
            </FieldDescription>
          </FieldGroup>
        </form>
        
      </CardContent>
    </Card>
  </div>
</template>
