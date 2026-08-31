import { useState } from "react";
import { Check, Copy, ExternalLink, PartyPopper, ThumbsDown, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../state/AppContext";
import { affUrl, copyText, logEvent, makeTid } from "../lib/utils";
import { Modal, StoreTile } from "./ui";

export function CouponModal() {
  const { active, closeModal, vote, votes, allStores, toast } = useApp();
  const [copied, setCopied] = useState(false);
  if (!active) return null;
  const store = allStores.find((s) => s.slug === active.store);
  if (!store) return null;
  const myVote = votes[active.id];

  const copy = async () => {
    const ok = await copyText(active.code);
    if (ok) {
      setCopied(true);
      toast("تم نسخ الكود");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast("تعذّر النسخ التلقائي — حدّد الكود وانسخه", "err");
    }
  };

  const goStore = () => {
  const tid = makeTid();
  logEvent({ type: "click", store: store.slug, coupon: active.id, tid });

  const destinationUrl = store.affiliate_url || store.url;

  window.open(
    affUrl(destinationUrl, tid),
    "_blank",
    "noopener,noreferrer"
  );
};

  return (
    <Modal onClose={closeModal} labelledBy="coupon-modal-title">
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <StoreTile store={store} size={52} />
          <div>
            <p className="text-xs font-bold text-ink-500">{store.name}</p>
            <h2 id="coupon-modal-title" className="font-display text-lg font-extrabold text-ink-950">
              تم نسخ الكود بنجاح <PartyPopper className="inline h-5 w-5 text-gold-500" />
            </h2>
          </div>
        </div>

        {/* code box */}
        <div className="mt-6 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50/50 p-5 text-center">
          <p className="text-[11px] font-bold tracking-wide text-ink-400">كود الخصم</p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="select-all font-mono text-3xl font-bold tracking-[0.18em] text-brand-950" dir="ltr">
              {active.code}
            </span>
          </div>
          <button
            onClick={copy}
            className={`btn-press mx-auto mt-4 flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition ${
              copied ? "bg-jade-500 text-white" : "bg-ink-950 text-white hover:bg-ink-800"
            }`}
          >
            {copied ? <Check className="h-4 w-4" strokeWidth={3} /> : <Copy className="h-4 w-4" />}
            {copied ? "تم النسخ" : "نسخ الكود"}
          </button>
        </div>

        <button
          onClick={goStore}
          className="btn-press mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gold-400 py-3.5 font-display text-base font-extrabold text-brand-950 shadow-soft transition hover:bg-gold-300"
        >
          الذهاب إلى {store.name}
          <ExternalLink className="h-5 w-5" />
        </button>
        <p className="mt-3 text-center text-xs leading-6 text-ink-500">
          سنفتح المتجر في نافذة جديدة. ألصق الكود عند الدفع للحصول على الخصم.
        </p>

        {/* vote */}
        <div className="mt-6 rounded-xl bg-ink-50/70 p-4">
          {!myVote ? (
            <>
              <p className="text-center text-sm font-bold text-ink-800">هل عمل الكود معك؟</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  onClick={() => vote(active.id, "up", store.slug)}
                  className="btn-press flex items-center justify-center gap-2 rounded-lg border border-jade-200 bg-white py-2.5 text-sm font-bold text-jade-700 transition hover:bg-jade-500 hover:text-white"
                >
                  <ThumbsUp className="h-4 w-4" />
                  نعم، يعمل
                </button>
                <button
                  onClick={() => vote(active.id, "down", store.slug)}
                  className="btn-press flex items-center justify-center gap-2 rounded-lg border border-flame-200 bg-white py-2.5 text-sm font-bold text-flame-700 transition hover:bg-flame-500 hover:text-white"
                >
                  <ThumbsDown className="h-4 w-4" />
                  لا يعمل
                </button>
              </div>
              <p className="mt-2 text-center text-[11px] text-ink-400">تقييمك يحدّث نسبة نجاح الكود لحظياً</p>
            </>
          ) : (
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-jade-700">
              <Check className="h-4 w-4" strokeWidth={3} />
              شكراً! تم تسجيل تقييمك وساعدت {active.rate}% من المتسوقين القادمين
            </div>
          )}
        </div>

        {/* terms */}
        <div className="mt-5">
          <p className="text-xs font-bold text-ink-400">شروط الكوبون</p>
          <ul className="mt-2 space-y-1.5">
            {active.terms.map((t) => (
              <li key={t} className="flex items-start gap-2 text-xs leading-5 text-ink-600">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-400" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <Link to={`/offer/${active.id}`} onClick={closeModal} className="mt-5 block text-center text-xs font-bold text-brand-700 underline-offset-4 hover:underline">
          عرض تفاصيل الكوبون كاملة
        </Link>
      </div>
    </Modal>
  );
}
