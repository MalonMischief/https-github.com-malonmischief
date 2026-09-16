import { SpreadConfig } from '../types';

export const SPREADS: SpreadConfig[] = [
  {
    id: 'losstaebe',
    title: 'Das Fränkische Zweig-Los',
    subtitle: 'Loshölzer vom Obstbaum auf weißem Linnen',
    runeCount: 3,
    description: 'Zweige eines fruchttragenden Baumes aus den rheinischen Auen werden mit heiligen Merkzeichen gekerbt und auf reines weißes Leinentuch gestreut. Drei Hölzer werden von der Seherin Albruna mit gen Himmel gerichtetem Blick gehoben.',
    frankishContext: 'Seit uralten Zeiten schnitten die Seherinnen und Sippenältesten am Rhein Stäbchen von Apfel- oder Eichenbäumen, um das Verborgene zu ergründen.',
    positions: [
      {
        label: '1. Der Ast der Herkunft',
        description: 'Was wurzelt im Vergangenen? Welche Saat wurde ausgebracht, die nun deine Gegenwart bestimmt?'
      },
      {
        label: '2. Das gefallene Los (Gegenwart)',
        description: 'Wo stehst du jetzt im Strome? Welche lebendige Kraft oder Härte prüft dein Herz?'
      },
      {
        label: '3. Der Rat der Seherin (Weg & Heil)',
        description: 'Wohin weist das lichte Zeichen? Welcher Schritt bringt Segen und Frieden für deinen Weg?'
      }
    ]
  },
  {
    id: 'single',
    title: 'Das Einzel-Los der Albruna',
    subtitle: 'Tagesbegleiter & Herzensrat',
    runeCount: 1,
    description: 'Ein einzelnes Holz wird aus dem Beutel der Seherin gezogen für eine unmissverständliche Antwort auf eine drängende Frage.',
    frankishContext: 'Ehe die Freien zu Verhandlungen ritten oder Entscheidungen trafen, baten sie die Seherin um ein einzelnes Leitzeichen.',
    positions: [
      {
        label: 'Das heilige Los',
        description: 'Die unverstellte Essenz deines Anliegens; das Leitzeichen für deine Gedanken.'
      }
    ]
  },
  {
    id: 'dreiklang',
    title: 'Der Dreiklang des Schicksals',
    subtitle: 'Gewordenes, Seiendes und Werdendes',
    runeCount: 3,
    description: 'Das Drei-Hölzer-Orakel für die Strömung der Zeit: Was hinter dir liegt, was dich jetzt umgibt, und was aus deinen Entschlüssen erwächst.',
    frankishContext: 'Die fränkischen Mütterinnen spinnen und weben den Lebensfaden der Menschen an den heiligen Quellen des Rheinlands.',
    positions: [
      {
        label: '1. Das Gewordene (Die Wurzel)',
        description: 'Alte Handlungen und Bündnisse, deren Echo noch in deinen Tagen nachhallt.'
      },
      {
        label: '2. Das Seiende (Die Strömung)',
        description: 'Die gegenwärtige Flut, in der du stehst; die Herausforderung des Augenblicks.'
      },
      {
        label: '3. Das Werdende (Die Reife)',
        description: 'Was heranwächst, wenn du den rechten Rat befolgst und deine Kräfte klug einsetzt.'
      }
    ]
  },
  {
    id: 'kreuz',
    title: 'Das Fränkische Schicksalskreuz',
    subtitle: 'Fünf Hölzer für tiefe Lebensfragen',
    runeCount: 5,
    description: 'Ein ehrwürdiges Legemuster, das die vier Winde und den Mittelpunkt des Menschen befragt.',
    frankishContext: 'Vor weitreichenden Entscheidungen der Sippe wurden fünf Hölzer gelegt, um das Innere, das Hemmnis, den Ahnenhalt und den Ausgang zu schauen.',
    positions: [
      {
        label: '1. Der Herdstand (Das Zentrum)',
        description: 'Dein innerer Zustand und das wahre Thema hinter deiner Frage.'
      },
      {
        label: '2. Der Stein im Strom (Das Hemmnis)',
        description: 'Was hält dich auf? Der Schatten oder Widerstand, dem du begegnen musst.'
      },
      {
        label: '3. Die Ahnenerde (Das Fundament)',
        description: 'Die Kraft deiner Herkunft und Sippe, die dich im Verborgenen stützt.'
      },
      {
        label: '4. Die sichere Furt (Der Rat)',
        description: 'Welche Tugend dir jetzt das Überqueren des tiefen Wassers erlaubt.'
      },
      {
        label: '5. Die lichte Mündung (Der Ausgang)',
        description: 'Was sich entfaltet, wenn du deinen Pfad mit Mut und Aufrichtigkeit gehst.'
      }
    ]
  }
];
