import Fetch from './components/database_form';

export default function Home() {
  return (
    <main className="w-dvw">
      <header className='flex justify-center h-[1dvh] gap-2'>
        <a href="https://github.com/Qinbeans/cheatbase#how-to-use" target='_blank'>
          <h1 className='text-3xl text-blue-200 mt-2 hover:text-blue-400 italic px-2 rounded border border-slate-400'>How To Use</h1>
        </a>
        <a href="https://qinbeans.net" target='_blank'>
          <h1 className='text-3xl text-blue-200 mt-2 hover:text-blue-400 italic px-2 rounded border border-slate-400'>Qinbeans</h1>
        </a>
      </header>
      <section className='grid place-content-center h-[99dvh]'>
        <Fetch />
      </section>
    </main>
  );
}
