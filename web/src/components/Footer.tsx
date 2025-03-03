function Footer() {
	return (
		<footer className="bg-gray-800 text-white py-8">
			<div className="container mx-auto px-4">
				<div className="text-center">
					<div className="text-2xl font-bold mb-4">Shorty</div>
					<div className="text-gray-400 mb-4">
						© 2025 Shorty. All rights reserved.
					</div>
					<div className="flex justify-center space-x-4">
						<a href="#" className="text-gray-400 hover:text-white">
							Terms
						</a>
						<a href="#" className="text-gray-400 hover:text-white">
							Privacy
						</a>
						<a href="#" className="text-gray-400 hover:text-white">
							Contact
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
