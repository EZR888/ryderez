import pandas as pd
import numpy as np
import scipy.stats as stats
import matplotlib.pyplot as plt

class PsiTestSuite:
    def __init__(self, reference_file, psi_file):
        self.reference_data = self.load_data(reference_file)
        self.psi_data = self.load_data(psi_file)
        
    def load_data(self, file_path):
        """Loads CSV data, expecting columns with individual spins."""
        return pd.read_csv(file_path)
    
    def compute_frequencies(self, data):
        """Calculates frequencies of each number in the dataset."""
        all_spins = data.values.flatten()
        unique, counts = np.unique(all_spins, return_counts=True)
        freq_dist = dict(zip(unique, counts))
        return freq_dist
    
    def chi_square_test(self):
        """Compares psi data distribution to reference data using Chi-Square test."""
        ref_freq = self.compute_frequencies(self.reference_data)
        psi_freq = self.compute_frequencies(self.psi_data)
        
        # Align reference and psi frequencies
        all_numbers = sorted(set(ref_freq.keys()).union(set(psi_freq.keys())))
        ref_counts = [ref_freq.get(num, 0) for num in all_numbers]
        psi_counts = [psi_freq.get(num, 0) for num in all_numbers]
        
        chi2, p = stats.chisquare(psi_counts, f_exp=ref_counts)
        print(f"Chi-Square Test: χ²={chi2:.3f}, p={p:.6f}")
        return chi2, p
    
    def visualize_distributions(self):
        """Plots histograms comparing psi data to reference data."""
        ref_freq = self.compute_frequencies(self.reference_data)
        psi_freq = self.compute_frequencies(self.psi_data)
        
        all_numbers = sorted(set(ref_freq.keys()).union(set(psi_freq.keys())))
        ref_counts = [ref_freq.get(num, 0) for num in all_numbers]
        psi_counts = [psi_freq.get(num, 0) for num in all_numbers]
        
        plt.figure(figsize=(12, 6))
        plt.bar(all_numbers, ref_counts, alpha=0.6, label='Reference Data')
        plt.bar(all_numbers, psi_counts, alpha=0.6, label='Psi Data')
        plt.xlabel('Roulette Number')
        plt.ylabel('Frequency')
        plt.legend()
        plt.title('Psi Data vs. Reference Data Distribution')
        plt.show()
    
    def run_tests(self):
        """Runs all statistical tests and visualizations."""
        print("Running Chi-Square Test...")
        self.chi_square_test()
        print("Visualizing Distributions...")
        self.visualize_distributions()

# Example usage:
# test_suite = PsiTestSuite('reference_10M.csv', 'psi_trial.csv')
# test_suite.run_tests()

