'use client'
function BrokenButton({text}) {
  <button className="bg-red-600 p-2 rounded">{text}</button> // ❌ No return
}
export default BrokenButton;
