"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";

export type PostCallWizardLabels = {
  introTitle: string;
  introSubtitle: string;
  introCta: string;
  satisfactionQuestion: string;
  yes: string;
  no: string;
  declinedThanks: string;
  declinedClose: string;
  accountTypeQuestion: string;
  individual: string;
  corporate: string;
  nameQuestion: string;
  firstNamePlaceholder: string;
  lastNamePlaceholder: string;
  next: string;
  emailQuestion: string;
  emailPlaceholder: string;
  projectQuestion: string;
  projectPlaceholder: string;
  contactTitlePrefix: string;
  contactTitleSuffix: string;
  phonePlaceholder: string;
  callbackPlaceholder: string;
  callbackMorning: string;
  callbackAfternoon: string;
  consentContact: string;
  consentKvkk: string;
  send: string;
  doneTitle: string;
  doneSubtitle: string;
  close: string;
  validationRequired: string;
  validationChecks: string;
};

type WizardPhase =
  | "intro"
  | "satisfaction"
  | "accountType"
  | "name"
  | "email"
  | "project"
  | "contact"
  | "done"
  | "declined";

type Props = {
  open: boolean;
  onClose: () => void;
  initialPhone: string;
  labels: PostCallWizardLabels;
  locale: string;
  liteMotion: boolean;
  isMobile: boolean;
};

export function PostCallLeadWizard({
  open,
  onClose,
  initialPhone,
  labels,
  locale,
  liteMotion,
  isMobile,
}: Props) {
  const [phase, setPhase] = useState<WizardPhase>("intro");
  const [accountType, setAccountType] = useState<
    "individual" | "corporate" | null
  >(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [project, setProject] = useState("");
  const [phone, setPhone] = useState("");
  const [callbackPref, setCallbackPref] = useState<
    "morning" | "afternoon" | ""
  >("");
  const [consentContact, setConsentContact] = useState(false);
  const [consentKvkk, setConsentKvkk] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPhase("intro");
    setAccountType(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setProject("");
    setPhone(initialPhone.trim());
    setCallbackPref("");
    setConsentContact(false);
    setConsentKvkk(false);
    setFieldError(null);
    setSubmitting(false);
  }, [open, initialPhone]);

  const gradientBtn =
    "relative min-h-[52px] w-full rounded-2xl bg-gradient-to-r from-[#2563eb] via-[#6366f1] to-[#9333ea] py-3.5 text-base font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12)] transition-[filter] md:hover:brightness-110 disabled:opacity-50";

  const outlineBtn =
    "min-h-[52px] w-full rounded-2xl border border-white/20 bg-white/[0.04] py-3.5 text-base font-semibold tracking-wide text-white transition-colors md:hover:border-white/35 md:hover:bg-white/[0.07]";

  const inputCls =
    "w-full rounded-2xl border border-white/15 bg-[#0d0d0d]/95 px-4 py-3.5 text-base text-white outline-none placeholder:text-zinc-600 focus:border-[#2563eb]/55 focus:ring-2 focus:ring-[#2563eb]/25";

  const handleFinalSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setFieldError(null);
      if (!phone.trim()) {
        setFieldError(labels.validationRequired);
        return;
      }
      if (!callbackPref) {
        setFieldError(labels.validationRequired);
        return;
      }
      if (!consentContact || !consentKvkk) {
        setFieldError(labels.validationChecks);
        return;
      }
      setSubmitting(true);
      try {
        const res = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locale,
            accountType,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            projectDescription: project.trim(),
            phone: phone.trim(),
            callbackPreference: callbackPref,
            consentContact,
            consentKvkk,
          }),
        });
        if (!res.ok) {
          setFieldError(labels.validationRequired);
          return;
        }
        setPhase("done");
      } catch {
        setFieldError(labels.validationRequired);
      } finally {
        setSubmitting(false);
      }
    },
    [
      phone,
      callbackPref,
      consentContact,
      consentKvkk,
      locale,
      accountType,
      firstName,
      lastName,
      email,
      project,
      labels,
    ],
  );

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            key="lead-backdrop"
            className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            aria-hidden
          />
          <div
            className={`pointer-events-none fixed inset-0 z-[111] flex justify-center ${isMobile ? "items-end p-0" : "items-center p-4 sm:p-6"}`}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="lead-wizard-title"
              className={`pointer-events-auto relative w-full max-w-md ${isMobile ? "max-h-[min(92dvh,880px)] rounded-t-[1.35rem] border-x-0 border-t border-white/10" : "max-h-[min(88vh,760px)] rounded-[1.35rem] border border-white/10"} overflow-hidden bg-[#080808]/95 shadow-[0_0_60px_-12px_rgba(147,51,234,0.35)] backdrop-blur-xl`}
              initial={
                liteMotion ? { opacity: 0, y: 12 } : { opacity: 0, y: 24 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                liteMotion ? { opacity: 0, y: 8 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: liteMotion ? 0.28 : 0.4 }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:14px_14px]"
                aria-hidden
              />
              <div className="relative max-h-[inherit] overflow-y-auto overscroll-contain px-5 pb-8 pt-6 sm:px-7 sm:pb-9 sm:pt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-3 top-3 rounded-xl border border-white/10 bg-white/[0.06] p-2 text-zinc-400 transition-colors md:hover:bg-white/10 md:hover:text-white"
                  aria-label={labels.close}
                >
                  <X className="h-5 w-5" strokeWidth={2} />
                </button>

                <h2
                  id="lead-wizard-title"
                  className="pr-10 text-center text-lg font-semibold leading-snug text-white sm:text-xl"
                >
                  {phase === "intro" && labels.introTitle}
                  {phase === "satisfaction" && labels.satisfactionQuestion}
                  {phase === "accountType" && labels.accountTypeQuestion}
                  {phase === "name" && labels.nameQuestion}
                  {phase === "email" && labels.emailQuestion}
                  {phase === "project" && labels.projectQuestion}
                  {phase === "contact" &&
                    `${labels.contactTitlePrefix}${firstName.trim() || "…"}${labels.contactTitleSuffix}`}
                  {phase === "done" && labels.doneTitle}
                  {phase === "declined" && labels.declinedThanks}
                </h2>

                {phase === "intro" ? (
                  <div className="mt-6 space-y-6">
                    <p className="text-center text-sm leading-relaxed text-zinc-400">
                      {labels.introSubtitle}
                    </p>
                    <button
                      type="button"
                      className={gradientBtn}
                      onClick={() => setPhase("satisfaction")}
                    >
                      {labels.introCta}
                    </button>
                  </div>
                ) : null}

                {phase === "satisfaction" ? (
                  <div className="mt-8 flex flex-col gap-3">
                    <button
                      type="button"
                      className={outlineBtn}
                      onClick={() => setPhase("accountType")}
                    >
                      {labels.yes}
                    </button>
                    <button
                      type="button"
                      className={outlineBtn}
                      onClick={() => setPhase("declined")}
                    >
                      {labels.no}
                    </button>
                  </div>
                ) : null}

                {phase === "declined" ? (
                  <div className="mt-6 space-y-6">
                    <p className="text-center text-sm text-zinc-500">
                      {labels.declinedThanks}
                    </p>
                    <button
                      type="button"
                      className={gradientBtn}
                      onClick={onClose}
                    >
                      {labels.declinedClose}
                    </button>
                  </div>
                ) : null}

                {phase === "accountType" ? (
                  <div className="mt-8 flex flex-col gap-3">
                    <button
                      type="button"
                      className={outlineBtn}
                      onClick={() => {
                        setAccountType("individual");
                        setPhase("name");
                      }}
                    >
                      {labels.individual}
                    </button>
                    <button
                      type="button"
                      className={outlineBtn}
                      onClick={() => {
                        setAccountType("corporate");
                        setPhase("name");
                      }}
                    >
                      {labels.corporate}
                    </button>
                  </div>
                ) : null}

                {phase === "name" ? (
                  <form
                    className="mt-8 space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!firstName.trim() || !lastName.trim()) {
                        setFieldError(labels.validationRequired);
                        return;
                      }
                      setFieldError(null);
                      setPhase("email");
                    }}
                  >
                    <input
                      className={inputCls}
                      placeholder={labels.firstNamePlaceholder}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                    />
                    <input
                      className={inputCls}
                      placeholder={labels.lastNamePlaceholder}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                    />
                    {fieldError ? (
                      <p className="text-center text-xs text-red-400">
                        {fieldError}
                      </p>
                    ) : null}
                    <button type="submit" className={gradientBtn}>
                      {labels.next}
                    </button>
                  </form>
                ) : null}

                {phase === "email" ? (
                  <form
                    className="mt-8 space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!email.trim() || !email.includes("@")) {
                        setFieldError(labels.validationRequired);
                        return;
                      }
                      setFieldError(null);
                      setPhase("project");
                    }}
                  >
                    <input
                      type="email"
                      className={inputCls}
                      placeholder={labels.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                    {fieldError ? (
                      <p className="text-center text-xs text-red-400">
                        {fieldError}
                      </p>
                    ) : null}
                    <button type="submit" className={gradientBtn}>
                      {labels.next}
                    </button>
                  </form>
                ) : null}

                {phase === "project" ? (
                  <form
                    className="mt-8 space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!project.trim()) {
                        setFieldError(labels.validationRequired);
                        return;
                      }
                      setFieldError(null);
                      setPhase("contact");
                    }}
                  >
                    <textarea
                      rows={5}
                      className={`${inputCls} min-h-[140px] resize-y`}
                      placeholder={labels.projectPlaceholder}
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                    />
                    {fieldError ? (
                      <p className="text-center text-xs text-red-400">
                        {fieldError}
                      </p>
                    ) : null}
                    <button type="submit" className={gradientBtn}>
                      {labels.next}
                    </button>
                  </form>
                ) : null}

                {phase === "contact" ? (
                  <form className="mt-8 space-y-5" onSubmit={handleFinalSubmit}>
                    <input
                      type="tel"
                      className={inputCls}
                      placeholder={labels.phonePlaceholder}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                    />
                    <div className="relative">
                      <select
                        className={`${inputCls} appearance-none pr-10`}
                        value={callbackPref}
                        onChange={(e) =>
                          setCallbackPref(
                            e.target.value as "morning" | "afternoon" | "",
                          )
                        }
                        aria-label={labels.callbackPlaceholder}
                      >
                        <option value="">{labels.callbackPlaceholder}</option>
                        <option value="morning">
                          {labels.callbackMorning}
                        </option>
                        <option value="afternoon">
                          {labels.callbackAfternoon}
                        </option>
                      </select>
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                        ▾
                      </span>
                    </div>
                    <label className="flex cursor-pointer gap-3 text-left text-xs leading-relaxed text-zinc-400">
                      <input
                        type="checkbox"
                        checked={consentContact}
                        onChange={(e) =>
                          setConsentContact(e.target.checked)
                        }
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-[#0d0d0d]"
                      />
                      <span>{labels.consentContact}</span>
                    </label>
                    <label className="flex cursor-pointer gap-3 text-left text-xs leading-relaxed text-zinc-400">
                      <input
                        type="checkbox"
                        checked={consentKvkk}
                        onChange={(e) => setConsentKvkk(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-[#0d0d0d]"
                      />
                      <span>{labels.consentKvkk}</span>
                    </label>
                    {fieldError ? (
                      <p className="text-center text-xs text-red-400">
                        {fieldError}
                      </p>
                    ) : null}
                    <button
                      type="submit"
                      disabled={submitting}
                      className={gradientBtn}
                    >
                      {submitting ? "…" : labels.send}
                    </button>
                  </form>
                ) : null}

                {phase === "done" ? (
                  <div className="mt-8 space-y-6 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/15 text-emerald-300">
                      <Check className="h-7 w-7" strokeWidth={2} />
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      {labels.doneSubtitle}
                    </p>
                    <button
                      type="button"
                      className={gradientBtn}
                      onClick={onClose}
                    >
                      {labels.close}
                    </button>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
