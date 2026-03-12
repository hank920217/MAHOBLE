function ConnectButton({ disabled, loading, onConnect }) {
  return (
    <button
      className="button button--primary button--mobile-tight"
      disabled={disabled || loading}
      onClick={onConnect}
      type="button"
    >
      {loading ? '連線中...' : '連接藍牙裝置'}
    </button>
  )
}

export default ConnectButton
