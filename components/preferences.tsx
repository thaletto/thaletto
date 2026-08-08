'use client'

import { Popover } from '@base-ui/react/popover'
import { Monitor, Moon, Sun, Volume2, VolumeX } from 'lucide-react'

import { PreferencesIcon } from '~/components/dock-icons'
import { useTheme } from '~/components/theme-provider'
import { useEffect, useState } from 'react'

import { TabItem, Tabs, TabsList } from '~/components/ui/tabs'
import { Elevated } from '~/lib/elevated'
import {
  playPreferenceSound,
  setSoundEnabled,
  soundEnabled,
} from '~/lib/sound'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="prefs-row">
      <span className="prefs-row-label">{label}</span>
      {children}
    </div>
  )
}

// The dock's preferences panel: theme and UI sound, each as full-width
// fluid tabs.
export function Preferences() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [sound, setSound] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSound(soundEnabled())
  }, [])

  return (
    <Popover.Root>
      <Popover.Trigger
        render={
          <button
            type="button"
            className="dock-item"
            aria-label="Preferences"
            disabled={!mounted}
          >
            <PreferencesIcon />
            <span className="dock-tip" aria-hidden>
              Preferences
            </span>
          </button>
        }
      />
      <Popover.Portal>
        <Popover.Positioner
          side="top"
          sideOffset={14}
          positionMethod="fixed"
          className="z-[var(--z-card)] outline-none"
        >
          <Popover.Popup
            aria-label="Preferences"
            initialFocus
            finalFocus
            render={<Elevated offset={2} shadowLevel={3} />}
            className="prefs-panel w-max rounded-xl outline-none"
          >
            <Row label="Theme">
              <Tabs
                value={mounted && theme ? theme : 'system'}
                onValueChange={(v) => {
                  setTheme(v)
                  playPreferenceSound()
                }}
              >
                <TabsList aria-label="Theme">
                  <TabItem value="light" icon={Sun} label="" aria-label="Light" />
                  <TabItem value="system" icon={Monitor} label="" aria-label="System" />
                  <TabItem value="dark" icon={Moon} label="" aria-label="Dark" />
                </TabsList>
              </Tabs>
            </Row>
            <Row label="Sound">
              <Tabs
                value={mounted && sound ? 'on' : 'off'}
                onValueChange={(v) => {
                  const on = v === 'on'
                  if (!on) playPreferenceSound()
                  setSoundEnabled(on)
                  setSound(on)
                  if (on) playPreferenceSound()
                }}
              >
                <TabsList aria-label="Sound">
                  <TabItem value="on" icon={Volume2} label="" aria-label="On" />
                  <TabItem value="off" icon={VolumeX} label="" aria-label="Off" />
                </TabsList>
              </Tabs>
            </Row>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}