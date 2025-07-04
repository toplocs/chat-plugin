# TopLocs Chat Plugin (P2P)

A pure peer-to-peer chat plugin for the TopLocs/Tribelike platform using Gun.js.

## Features

- 🌐 **Pure P2P Architecture** - No central server required
- 💬 **Real-time Messaging** - Instant message sync via Gun.js
- 🏠 **Chat Rooms** - Create and join topic-based chat rooms
- 🔒 **Privacy-First** - Your data stays on the P2P network
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Customizable** - Settings for notifications, display, and privacy

## Architecture

This plugin demonstrates the TopLocs vision of pure P2P functionality:

- **Gun.js** for decentralized data storage and real-time sync
- **No Backend Required** - Everything runs in the browser
- **Module Federation** - Dynamic loading as a Tribelike plugin
- **Vue 3 + TypeScript** - Modern, type-safe development

## Data Structure

```javascript
// Chat rooms stored at:
gun.get('chat-rooms').get(space).get(roomId)

// Messages stored at:
gun.get('chat-messages').get(roomId).get(messageId)

// User settings at:
gun.user().get('chat-settings')

// Recent chats at:
gun.user().get('recent-chats')
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Integration with Tribelike

The plugin exposes three components via Module Federation:

1. **Main** - The main chat interface
2. **Settings** - Chat preferences and configuration
3. **Sidebar** - Recent chats widget for the sidebar

Each component receives:
- `gun` - The Gun.js instance
- `user` - Current authenticated user
- `space` - Current space context (local/global)

## P2P Benefits

- **No Server Costs** - Runs entirely on the Gun.js network
- **Censorship Resistant** - No central point of control
- **Always Available** - Works as long as peers are online
- **Data Ownership** - Users control their own data

## Contributing

This plugin is part of the TopLocs ecosystem. Contributions welcome!

## License

Same as the TopLocs/Tribelike project.