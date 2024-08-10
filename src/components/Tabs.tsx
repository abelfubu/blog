import { createSignal } from 'solid-js';
type Props = {
  items: {
    company: string;
    title: string;
    date: string;
    description: string[];
  }[];
};

export default function Tabs({ items }: Props) {
  const [active, setActive] = createSignal(0);

  const job = () => items[active()];

  return (
    <nav>
      <ul class="flex overflow-x-scroll md:overflow-x-auto">
        {items.map((item, i) => (
          <li
            onClick={() => setActive(i)}
            class={[
              'border-b-[var(--primary)] border-b m-0 px-4 py-2 cursor-pointer hover:bg-[var(--primary)] hover:opacity-50 hover:text-black transition-all',
              active() === i && 'bg-[var(--primary)] text-black',
            ].join(' ')}
          >
            {item.company}
          </li>
        ))}
      </ul>

      <div class="pt-4">
        <p class="text-4xl mb-0">{job().company}</p>
        <p class="m-0 text-2xl text-[var(--primary)]">{job().title}</p>
        <p>{job().date}</p>
        {job().description.map((desc) => (
          <p>{desc}</p>
        ))}
      </div>
    </nav>
  );
}
