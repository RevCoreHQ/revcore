/* eslint-disable @typescript-eslint/no-explicit-any */
export function mapResults(items: any[]): any[] {
  return (items || []).map((item: any) => {
    const addrParts = (item.address || '').split(',').map((s: string) => s.trim());
    const stateZip = addrParts.length >= 3 ? addrParts[addrParts.length - 1] : '';
    const city = addrParts.length >= 3 ? addrParts[addrParts.length - 2] : '';
    const state = stateZip.split(' ')[0] || '';

    let email = '';
    if (item.emails && item.emails.length > 0) {
      email = item.emails[0];
    } else if (item.email) {
      email = item.email;
    }

    return {
      businessName: item.title || item.name || '',
      phone: item.phone || item.phoneUnformatted || '',
      email,
      website: item.website || item.url || '',
      address: item.address || item.street || '',
      city,
      state,
      rating: item.totalScore ?? item.rating ?? 0,
      reviews: item.reviewsCount ?? item.reviews ?? 0,
      category: item.categoryName || item.category || '',
      placeId: item.placeId || '',
      googleUrl: item.url || '',
      lat: item.location?.lat ?? 0,
      lng: item.location?.lng ?? 0,
      claimStatus: item.claimingStatus || '',
      permanentlyClosed: item.permanentlyClosed || false,
      openingHours: item.openingHours || null,
      additionalInfo: item.additionalInfo || null,
    };
  });
}
