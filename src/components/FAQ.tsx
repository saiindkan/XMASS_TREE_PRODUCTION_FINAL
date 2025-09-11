export default function FAQ() {
  return (
    <section className="w-full bg-white border-t border-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-green-900 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <div className="font-semibold text-green-800 mb-1">How fast is shipping?</div>
            <div className="text-gray-700">Most orders ship within 1-2 business days and arrive in 3-5 business days.</div>
          </div>
          <div>
            <div className="font-semibold text-green-800 mb-1">Are the trees easy to assemble?</div>
            <div className="text-gray-700">Yes! All of our trees come with simple instructions and take less than 10 minutes to set up.</div>
          </div>
          <div>
            <div className="font-semibold text-green-800 mb-1">Do you offer a warranty?</div>
            <div className="text-gray-700">Every tree includes a 3-year warranty covering lights and structure.</div>
          </div>
          <div>
            <div className="font-semibold text-green-800 mb-1">Can I return my tree?</div>
            <div className="text-gray-700">Yes! We offer free returns within 30 days of delivery if you’re not satisfied.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
