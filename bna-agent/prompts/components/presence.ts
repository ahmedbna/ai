export const presenceComponentReadmePrompt = `
# Convex PresenceComponent

A Convex component for managing presence functionality, i.e., a live-updating
list of users in a "room" including their status for when they were last online.

It can be tricky to implement presence efficiently, without any polling and
without re-running queries every time a user sends a heartbeat message. This
component implements presence via Convex scheduled functions such that clients
only receive updates when a user joins or leaves the room.

The most common use case for this component is via the usePresence hook, which
takes care of sending heartbeart messages to the server and gracefully
disconnecting a user when the screen is closed.

See \`example\` for an example of how to incorporate this hook into your
application.

## Installation

\`\`\`bash
npx expo install @convex-dev/presence expo-crypto
\`\`\`

## Usage

First, add the component to your Convex app:

\`convex/convex.config.ts\`

\`\`\`ts
import { defineApp } from "convex/server";
import presence from "@convex-dev/presence/convex.config";

const app = defineApp();
app.use(presence);
export default app;
\`\`\`

\`convex/presence.ts\`

\`\`\`ts
import { mutation, query } from "./_generated/server";
import { components } from "./_generated/api";
import { v } from "convex/values";
import { Presence } from "@convex-dev/presence";
import { getAuthUserId } from "@convex-dev/auth/server";

export const presence = new Presence(components.presence);

export const getUserId = query({
  args: {},
  returns: v.union(v.string(), v.null()),
  handler: async (ctx) => {
    return await getAuthUserId(ctx);
  },
});

export const heartbeat = mutation({
  args: { roomId: v.string(), userId: v.string(), sessionId: v.string(), interval: v.number() },
  handler: async (ctx, { roomId, userId, sessionId, interval }) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) {
      throw new Error("Not authenticated");
    }
    return await presence.heartbeat(ctx, roomId, authUserId, sessionId, interval);
  },
});

export const list = query({
  args: { roomToken: v.string() },
  handler: async (ctx, { roomToken }) => {
    const presenceList = await presence.list(ctx, roomToken);
    const listWithUserInfo = await Promise.all(
      presenceList.map(async (entry) => {
        const user = await ctx.db.get(entry.userId as Id<"users">);
        if (!user) {
          return entry;
        }
        return {
          ...entry,
          name: user?.name,
          image: user?.image,
        };
      })
    );
    return listWithUserInfo;
  },
});

export const disconnect = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    return await presence.disconnect(ctx, sessionToken);
  },
});
\`\`\`

A \`Presence\` Expo React Native component can be instantiated from your client code like this:

\`app/(tabs)/index.tsx\`

\`\`\`tsx
import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { usePresence } from '@convex-dev/presence/react-native';
import { View } from '@/components/ui/view';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const userId = useQuery(api.presence.getUserId);

  if (userId === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </View>
    );
  }

  if (userId === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Please log in to see your profile.</Text>
      </View>
    );
  }

  return <PresenceIndicator userId={userId} />;
}

function PresenceIndicator({ userId }: { userId: string }) {
  const presenceState = usePresence(api.presence, 'my-chat-room', userId);
  return <FacePile presenceState={presenceState ?? []} />;
}

interface PresenceState {
  userId: string;
  online: boolean;
  lastDisconnected: number;
  data?: Record<string, unknown>;
  name?: string;
  image?: string;
}

interface FacePileProps {
  presenceState: PresenceState[];
  maxVisible?: number;
}

function FacePile({ presenceState }: FacePileProps) {
  return (
    <View
      style={{
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}
      >
        {presenceState.map((presence, idx) => (
          <AvatarItem
            key={presence.userId}
            presence={presence}
            index={idx}
            total={presenceState.length}
          />
        ))}
      </View>
    </View>
  );
}

function getEmojiForUserId(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash |= 0;
  }
  const emojis = ['😊', '😃', '😎', '🤓', '😇', '🤖', '👻', '🐶', '🐱', '🐰'];
  return emojis[Math.abs(hash) % emojis.length];
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = Math.floor((now - timestamp) / 1000);

  if (diff < 60) return 'Last seen just now';
  if (diff < 3600) return \`Last seen \${Math.floor(diff / 60)}\ min ago\`;
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return \`Last seen \${hours}\ hour\${hours === 1 ? '' : 's'}\ ago\`;
  }
  const days = Math.floor(diff / 86400);
  return \`Last seen \${days}\ day\${days === 1 ? '' : 's'}\ ago\`;
}

function AvatarItem({
  presence,
  index,
  total,
}: {
  presence: PresenceState;
  index: number;
  total: number;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const borderColor = useThemeColor({}, 'border');
  const onlineBorder = useThemeColor({}, 'text');
  const cardBg = useThemeColor({}, 'card');

  return (
    <View
      style={{
        marginLeft: -8,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: total - index,
      }}
    >
      <TouchableOpacity
        onPress={() => setShowTooltip(!showTooltip)}
        activeOpacity={0.7}
      >
        <Avatar
          size={32}
          style={{
            borderColor: presence.online ? onlineBorder : borderColor,
            borderWidth: 2,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          }}
        >
          {presence.image ? (
            <AvatarImage
              source={{ uri: presence.image }}
              style={{
                width: '100%',
                height: '100%',
                opacity: presence.online ? 1 : 0.4,
              }}
            />
          ) : (
            <AvatarFallback textStyle={{ opacity: presence.online ? 1 : 0.4 }}>
              {getEmojiForUserId(presence.userId)}
            </AvatarFallback>
          )}
        </Avatar>
      </TouchableOpacity>

      {showTooltip && (
        <TouchableOpacity
          style={{ position: 'absolute', top: 40, left: -50, zIndex: 100 }}
          activeOpacity={1}
          onPress={() => setShowTooltip(false)}
        >
          <View
            style={{
              padding: 8,
              borderRadius: 6,
              minWidth: 120,
              elevation: 4,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              backgroundColor: cardBg,
            }}
          >
            <Text style={{ fontWeight: '500', fontSize: 12, marginBottom: 4 }}>
              {presence.name || presence.userId}
            </Text>
            <Text variant='caption' style={{ fontSize: 10 }}>
              {presence.online
                ? 'Online now'
                : getTimeAgo(presence.lastDisconnected)}
            </Text>

            {presence.data && Object.keys(presence.data).length > 0 && (
              <View style={{ marginTop: 8 }}>
                <View
                  style={{
                    height: 1,
                    marginVertical: 4,
                    backgroundColor: borderColor,
                  }}
                />
                {Object.entries(presence.data).map(([key, value]) => (
                  <Text
                    key={key}
                    variant='caption'
                    style={{ fontSize: 10, marginTop: 2 }}
                  >
                    <Text style={{ fontWeight: '600' }}>{key}: </Text>
                    {String(value)}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
\`\`\`

This is the function signature for the \`usePresence\` hook:

\`\`\`ts
export default function usePresence(
  presence: PresenceAPI,
  roomId: string,
  userId: string,
  interval: number = 10000,
  convexUrl?: string
): PresenceState[] | undefined
\`\`\`

You can copy this code and use the \`usePresence\` hook directly to implement your own styling.
`;
