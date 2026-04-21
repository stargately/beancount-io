import { en } from "@/translations/en";

export const fa: typeof en = {
  ...en,
  // bottom tab bar
  home: "خانه",
  ledger: "دفتر کل",
  journal: "روزنامه",
  settings: "تنظیمات",
  mine: "من",
  setting: "تنظیم",
  // mine
  reviewApp: "دوستش دارید؟ نظر بدهید :)",
  helpCenter: "مرکز کمک",
  currentLanguage: "زبان",
  currentVersion: "نسخه",
  theme: "تم",
  themeLight: "روشن",
  themeDark: "تیره",
  themeSystem: "سیستم",
  // logout alert
  logoutAlertMsg: "آیا مطمئن هستید که می‌خواهید خروج کنید؟",
  logoutAlertCancel: "لغو",
  logoutAlertConfirm: "خروج",
  logout: "خروج",
  loggingOut: "در حال خروج",
  loggingOutMessage: "لطفاً صبر کنید، در حال خروج امن شما هستیم...",
  loggingOutProgress: "در حال خروج...",
  // delete account alert
  deleteAccountAlertMsg:
    "آیا مطمئن هستید که می‌خواهید حساب خود را حذف کنید؟ این عمل قابل بازگشت نیست و تمام داده‌های شما را برای همیشه حذف خواهد کرد.",
  deleteAccountAlertCancel: "لغو",
  deleteAccountAlertConfirm: "حذف حساب",
  deleteAccount: "حذف حساب",
  deleteAccountDescription: "حذف دائمی حساب و داده‌ها",
  ledgerDescription: "انتخاب یا تغییر بین دفترهای کل",
  deleteAccountConfirmTitle: "تأیید حذف حساب",
  deleteAccountConfirmMessage:
    'برای تأیید، لطفاً "sudo delete my account" را در زیر بنویسید:',
  deleteAccountConfirmPhrase: "sudo delete my account",
  deleteAccountConfirmPlaceholder: "عبارت را اینجا بنویسید",
  // settings sections
  appSettings: "تنظیمات برنامه",
  accountSettings: "حساب",
  supportSettings: "پشتیبانی",
  login: "ورود / ثبت نام",
  signIn: "ورود",
  signUp: "ثبت نام",
  resetPassword: "بازنشانی رمز عبور",
  addTransaction: "افزودن تراکنش",
  assets: "دارایی‌ها",
  expenses: "هزینه‌ها",
  income: "درآمد",
  quickAdd: "افزودن سریع",
  accountPicker: "انتخاب حساب",
  next: "بعدی",
  cancel: "لغو",
  confirm: "تأیید",
  saving: "در حال ذخیره...",
  saveSuccess: "تراکنش ذخیره شد!",
  saveFailed: "ذخیره ناموفق",
  netAssets: "دارایی‌های خالص",
  accounts: "حساب‌ها",
  monthlyNetIncome: "درآمد خالص ماهانه",
  liabilities: "بدهی‌ها",
  equity: "حقوق صاحبان سهام",
  done: "تمام",
  payee: "دریافت‌کننده",
  narration: "شرح",
  from: "از",
  to: "به",
  date: "تاریخ",
  save: "ذخیره",
  pleaseInput: "لطفاً وارد کنید...",
  monthlyNetWorth: "ارزش خالص ماهانه",
  subscribe: "گزارش ایمیل",
  off: "خاموش",
  weekly: "هفتگی",
  monthly: "ماهانه",
  updating: "به‌روزرسانی...",
  updateSuccess: "اشتراک با موفقیت به‌روزرسانی شد",
  updateFailed: "به‌روزرسانی اشتراک ناموفق",
  inviteFriends: "دعوت دوستان",
  invite: "دعوت",
  copy: "کپی",
  copied: "کپی شد",
  share: "اشتراک‌گذاری",
  loading: "در حال بارگذاری...",
  inviteSummary:
    "این ابزار حرفه‌ای مدیریت مالی را به اشتراک بگذارید و به دیگران کمک کنید تا آینده مالی خود را بسازند.",
  referral: "معرفی",
  rewardSummary: "دعوت دوستان",
  rewardDetail:
    "این ابزار حرفه‌ای مدیریت مالی را به اشتراک بگذارید و به دیگران کمک کنید تا آینده مالی خود را بسازند.",
  recommend:
    "می‌خواهم این ابزار حرفه‌ای مدیریت مالی را که به من در سازماندهی مؤثر امور مالی‌ام کمک کرده است، به اشتراک بگذارم.",
  shareError: "اشتراک‌گذاری ناموفق",
  thanksShare: "از اشتراک‌گذاری متشکریم!!",
  noContactPermission: "مجوز دسترسی به مخاطبین وجود ندارد.",
  inputKeyword: "لطفاً کلمه کلیدی وارد کنید",
  resetPasswordDescription:
    "آدرس ایمیل خود را وارد کنید تا پیوندی برای بازنشانی رمز عبور دریافت کنید.",
  resetPasswordEmailSent:
    "ایمیلی به آدرس شما ارسال شده است. لطفاً ایمیل خود را بررسی کنید تا رمز عبور را بازنشانی کنید.",
  sendResetPasswordEmail: "ارسال ایمیل بازنشانی رمز عبور",
  amountEmptyError: "لطفاً مبلغ را وارد کنید",
  noDataCharts: "برای نمایش نمودارها سریع اضافه کنید",
  "01": "ژان",
  "02": "فور",
  "03": "مار",
  "04": "آور",
  "05": "مه",
  "06": "ژون",
  "07": "ژوی",
  "08": "اوت",
  "09": "سپت",
  "10": "اکت",
  "11": "نوا",
  "12": "دسا",
  // journal screen
  transactions: "Transactions", // TODO: needs native speaker review
  search: "Search", // TODO: needs native speaker review
  unknown: "Unknown", // TODO: needs native speaker review
  openAccount: "Open Account", // TODO: needs native speaker review
  closeAccount: "Close Account", // TODO: needs native speaker review
  transaction: "Transaction", // TODO: needs native speaker review
  loadingMore: "Loading more...", // TODO: needs native speaker review
  noMoreEntries: "No more entries", // TODO: needs native speaker review
  journalWelcomeTitle: "Welcome to your Journal! 📔", // TODO: needs native speaker review
  journalWelcomeMessage: "You don't have any journal entries yet.", // TODO: needs native speaker review
  journalWelcomeInstructions: "To get started:", // TODO: needs native speaker review
  journalWelcomeInstruction1:
    'Use the "Add Transaction" button to create entries', // TODO: needs native speaker review
  journalWelcomeInstruction2:
    "Upload beancount files through the web interface", // TODO: needs native speaker review
  journalWelcomeInstruction3: "Import existing accounting data", // TODO: needs native speaker review
  journalWelcomeInstructionFinal:
    "Once you add some transactions, they'll appear here.", // TODO: needs native speaker review
  journalNoEntriesForFilters:
    "No journal entries found for the current filters.", // TODO: needs native speaker review
  journalLoadError: "Failed to load journal: ", // TODO: needs native speaker review
  accountsPlural: "accounts", // TODO: needs native speaker review
  // journal entry context
  journalLoadingEntryContext: "در حال بارگذاری زمینه ورودی...", // TODO: needs native speaker review
  journalError: "خطا", // TODO: needs native speaker review
  journalNoData: "داده‌های زمینه ورودی در دسترس نیست", // TODO: needs native speaker review
  journalLocation: "موقعیت", // TODO: needs native speaker review
  journalEntryContext: "زمینه ورودی", // TODO: needs native speaker review
  journalBalancesBefore: "موجودی قبل از ورودی", // TODO: needs native speaker review
  journalBalancesAfter: "موجودی بعد از ورودی", // TODO: needs native speaker review
  journalSource: "کد منبع", // TODO: needs native speaker review
};
