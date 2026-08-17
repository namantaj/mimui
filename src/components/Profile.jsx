import React from 'react';
import { useLanguage } from '../context/LanguageContext';

function Profile({
  activeTab,
  setActiveTab,
  profileForm,
  handleProfileChange,
  handleProfileSubmit,
  bankForm,
  handleBankChange,
  handleBankSubmit,
  kycForm,
  handleKycChange,
  handleKycSubmit,
  triggerToast
}) {
  const { t } = useLanguage();

  return (
    <div>
      {/* Profile Header Card */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-xl shadow-sm mb-lg flex flex-col md:flex-row items-center md:items-start gap-lg relative overflow-hidden">
        
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface shadow-sm relative z-10 shrink-0">
          <img 
            alt="Profile Picture" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe8oLmHDjQpBARIImVqHvbh-ono3iANmz82cN0HNIuMXp_uoyQ4ZIMNgWKt7U_gmgBcHnpsD9jOWfUuIIImIe_pzvTcDRcnmD2mUVk1twt8IvTMuNcV5CFoI61OZD5GEex2j1ycgdYeilCQ4ijjf1zAaULdttqOMrA3GCWb530NxxxkuKOMLU7dQf06irnQ0yH_Me8dAKADm-VLwOcU91AquzmvS_DdBPe3QK_9BC7ctdtEU_Xxje9"
          />
          <button 
            type="button"
            onClick={() => triggerToast("Upload avatar dialog coming soon!")}
            className="absolute bottom-0 right-0 bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center hover:opacity-90 transition-colors shadow-md"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
        </div>

        <div className="flex-1 text-center md:text-left z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-sm">
            <div>
              <h2 className="font-display-lg-mobile md:font-display-lg text-on-surface mb-xs">{profileForm.fullName}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">{profileForm.email} • ID: MLM-847291</p>
            </div>
            <div className="flex gap-sm justify-center md:justify-end">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary/10 text-tertiary font-label-caps text-label-caps border border-tertiary/20">
                <span className="material-symbols-outlined text-xs mr-1">check_circle</span> {t('profile.verified')}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gold/10 text-gold font-label-caps text-label-caps border border-gold/20">
                Diamond Director
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md mt-lg border-t border-outline-variant pt-lg">
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">{t('profile.joinDate')}</p>
              <p className="font-title-sm text-title-sm text-on-surface">Oct 12, 2021</p>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">{t('profile.directReferrals')}</p>
              <p className="font-title-sm text-title-sm text-on-surface">42</p>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">{t('profile.teamSize')}</p>
              <p className="font-title-sm text-title-sm text-on-surface">1,284</p>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">{t('profile.totalEarnings')}</p>
              <p className="font-title-sm text-title-sm text-primary">$45,250.00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabbed Interface */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-outline-variant overflow-x-auto hide-scrollbar bg-surface-container-lowest">
          {[
            { id: 'personal', label: t('profile.personalTab') },
            { id: 'bank', label: t('profile.bankTab') },
            { id: 'kyc', label: t('profile.kycTab') }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-lg py-md font-title-sm text-title-sm whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                  isActive 
                    ? 'text-primary border-primary bg-surface-container-low' 
                    : 'text-on-surface-variant border-transparent hover:text-on-surface hover:bg-surface-container-lowest'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content area */}
        <div className="p-lg md:p-xl">
          
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <form onSubmit={handleProfileSubmit} className="space-y-xl max-w-[800px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="space-y-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Full Name</label>
                  <input 
                    name="fullName"
                    value={profileForm.fullName}
                    onChange={handleProfileChange}
                    className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow" 
                    type="text" 
                  />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Email Address</label>
                  <input 
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow" 
                    type="email" 
                  />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Phone Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-md rounded-l-lg border border-r-0 border-outline-variant bg-surface-container-lowest text-on-surface-variant font-body-md text-body-md">
                      +1
                    </span>
                    <input 
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      className="flex-1 h-10 px-md rounded-r-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow" 
                      type="tel" 
                    />
                  </div>
                </div>
                <div className="space-y-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Date of Birth</label>
                  <input 
                    name="dob"
                    value={profileForm.dob}
                    onChange={handleProfileChange}
                    className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow" 
                    type="date" 
                  />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Gender</label>
                  <select 
                    name="gender"
                    value={profileForm.gender}
                    onChange={handleProfileChange}
                    className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow appearance-none"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
              </div>

              <hr className="border-outline-variant/50" />
              
              {/* Address Section */}
              <div className="space-y-lg">
                <h3 className="font-title-sm text-title-sm text-on-surface">Residential Address</h3>
                <div className="space-y-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Street Address</label>
                  <input 
                    name="street"
                    value={profileForm.street}
                    onChange={handleProfileChange}
                    className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow" 
                    type="text" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                  <div className="space-y-xs">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">City</label>
                    <input 
                      name="city"
                      value={profileForm.city}
                      onChange={handleProfileChange}
                      className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow" 
                      type="text" 
                    />
                  </div>
                  <div className="space-y-xs">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">State/Province</label>
                    <input 
                      name="state"
                      value={profileForm.state}
                      onChange={handleProfileChange}
                      className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow" 
                      type="text" 
                    />
                  </div>
                  <div className="space-y-xs">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">Zip/Postal Code</label>
                    <input 
                      name="zip"
                      value={profileForm.zip}
                      onChange={handleProfileChange}
                      className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow" 
                      type="text" 
                    />
                  </div>
                </div>
                <div className="space-y-xs md:w-1/3">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Country</label>
                  <select 
                    name="country"
                    value={profileForm.country}
                    onChange={handleProfileChange}
                    className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow appearance-none"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-md pt-md">
                <button 
                  type="button" 
                  onClick={() => triggerToast("Changes cancelled", "info")}
                  className="px-xl py-sm rounded-lg bg-surface border border-outline-variant text-on-surface font-title-sm text-title-sm hover:bg-surface-container-lowest transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-xl py-sm rounded-lg bg-primary text-on-primary font-title-sm text-title-sm hover:opacity-95 transition-all shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Bank Details Tab */}
          {activeTab === 'bank' && (
            <form onSubmit={handleBankSubmit} className="space-y-xl max-w-[800px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="space-y-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Bank Name</label>
                  <input 
                    name="bankName"
                    value={bankForm.bankName}
                    onChange={handleBankChange}
                    className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow" 
                    type="text" 
                  />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Account Number</label>
                  <input 
                    name="accountNumber"
                    value={bankForm.accountNumber}
                    onChange={handleBankChange}
                    className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow" 
                    type="text" 
                  />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Account Holder Name</label>
                  <input 
                    name="holderName"
                    value={bankForm.holderName}
                    onChange={handleBankChange}
                    className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow" 
                    type="text" 
                  />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">IFSC / SWIFT Code</label>
                  <input 
                    name="ifscCode"
                    value={bankForm.ifscCode}
                    onChange={handleBankChange}
                    className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow" 
                    type="text" 
                  />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Account Type</label>
                  <select 
                    name="accountType"
                    value={bankForm.accountType}
                    onChange={handleBankChange}
                    className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow appearance-none"
                  >
                    <option>Savings</option>
                    <option>Current</option>
                    <option>Checking</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-md pt-md">
                <button 
                  type="button" 
                  onClick={() => triggerToast("Changes cancelled", "info")}
                  className="px-xl py-sm rounded-lg bg-surface border border-outline-variant text-on-surface font-title-sm text-title-sm hover:bg-surface-container-lowest transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-xl py-sm rounded-lg bg-primary text-on-primary font-title-sm text-title-sm hover:opacity-95 transition-all shadow-md"
                >
                  Save Bank Details
                </button>
              </div>
            </form>
          )}

          {/* KYC Verification Tab */}
          {activeTab === 'kyc' && (
            <form onSubmit={handleKycSubmit} className="space-y-xl max-w-[800px]">
              <div className="p-lg bg-surface border border-outline-variant rounded-xl flex items-center gap-md">
                <span className="material-symbols-outlined text-tertiary text-[32px] filled-icon">verified_user</span>
                <div>
                  <h4 className="font-bold text-on-surface">KYC Status: {kycForm.status}</h4>
                  <p className="text-body-sm text-on-surface-variant">Your KYC documents have been approved. You are ready to process withdrawals.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="space-y-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Document Type</label>
                  <select 
                    name="docType"
                    value={kycForm.docType}
                    onChange={handleKycChange}
                    className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow appearance-none"
                  >
                    <option>Passport</option>
                    <option>National ID / SSN</option>
                    <option>Driver's License</option>
                  </select>
                </div>
                <div className="space-y-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Document Number</label>
                  <input 
                    name="docNumber"
                    value={kycForm.docNumber}
                    onChange={handleKycChange}
                    className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow" 
                    type="text" 
                  />
                </div>
              </div>

              {/* Document Uploader Design */}
              <div className="space-y-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant">Uploaded Document</label>
                <div 
                  onClick={() => triggerToast("Upload avatar dialog coming soon!")}
                  className="border-2 border-dashed border-outline-variant rounded-xl p-xl text-center hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-xs">cloud_upload</span>
                  <p className="font-bold text-body-md mb-xs">passport_alexander_wright.pdf</p>
                  <p className="text-body-sm text-on-surface-variant">PDF, PNG or JPG up to 10MB (Click to replace file)</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-md pt-md">
                <button 
                  type="button" 
                  onClick={() => triggerToast("Changes cancelled", "info")}
                  className="px-xl py-sm rounded-lg bg-surface border border-outline-variant text-on-surface font-title-sm text-title-sm hover:bg-surface-container-lowest transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-xl py-sm rounded-lg bg-primary text-on-primary font-title-sm text-title-sm hover:opacity-95 transition-all shadow-md"
                >
                  Re-submit KYC
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default Profile;
