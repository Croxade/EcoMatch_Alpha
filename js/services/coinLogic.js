import { state } from '../models/db.js';
import { toast } from '../utils/helpers.js';
import { sync, renderWallet, renderDash } from '../controllers/uiCtrl.js';

export function addCoins(n, label) {
  state.coins += n;
  state.history.unshift([label, "+" + n + " EC", "Just now"]);
  sync();
  renderWallet();
  renderDash();
  toast(`+${n} EcoCoin berhasil masuk.`);
}