<script setup lang="ts"></script>

<template>
  <UiSidebar
    collapsible="icon"
    class="bg-newblack group-data-[side=left]:border-r-gray-400"
  >
    <UiSidebarHeader>
      <UiSidebarMenu class="pl-0">
        <UiSidebarMenuItem>
          <UiSidebarMenuButton size="custom" class="overflow-visible">
            <NuxtLink to="/" class="flex items-center gap-4">
              <NuxtImg src="/mini_logo.png" class="w-14 h-auto" />
              <span class="text-secondary text-3xl pl-3">LAVello</span>
            </NuxtLink>
          </UiSidebarMenuButton>
        </UiSidebarMenuItem>
      </UiSidebarMenu>
    </UiSidebarHeader>

    <UiSidebarContent>
      <nav class="flex flex-col flex-1 gap-2 items-center mt-12">
        <UiSidebarMenu class="pl-2">
          <UiSidebarMenuItem>
            <UiSidebarMenuButton size="custom">
              <NuxtLink
                to="/dashboard"
                class="flex items-center flex-grow gap-4 p-2 text-newwhite capitalize font-bold rounded-md duration-300 hover:text-[#1b9b4f] hover:opacity-70 hover:bg-newwhite"
              >
                <Icon name="mage:dashboard-3" class="text-2xl" />
                <span>Main</span>
              </NuxtLink>
            </UiSidebarMenuButton>
          </UiSidebarMenuItem>
          <LayoutNavigationSidebarNavBoards />
        </UiSidebarMenu>
      </nav>
    </UiSidebarContent>

    <UiSidebarRail>
      <Icon
        name="icon-park-outline:expand-right"
        size="32"
        class="group-data-[state=collapsed]:rotate-180 text-primary"
      />
    </UiSidebarRail>
  </UiSidebar>
</template>

<style scoped></style>
