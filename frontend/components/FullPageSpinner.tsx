// components/FullPagespinner.tsx

export default function FullPageSpinner() {
	return (
		<div className="flex items-center justify-center h-screen bg-gray-50">
		  <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
		</div>
	);
}