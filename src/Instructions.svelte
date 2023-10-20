<script lang="ts">
</script>

<div id="readme-area">
  <h3>How to use this tool:</h3>
  <ol>
    <li>
      Insert your hours one time range per line, eg. "9:00-12:00 Rankkaa
      konsultointia" without the quotes
    </li>
    <li>Click 'Process input'-button</li>
  </ol>
  <h3>Note that:</h3>
  <ul>
    <li>
      The hours MUST be supplied in the following format: [Start time]-[End
      time]: [Description]
    </li>
    <li>There MUST be a nonzero amount of whitespace after the time range</li>
    <li>The time range MAY NOT contain any whitespace</li>
    <li>
      Additional whitespace and empty rows are allowed, the tool will clean
      these
    </li>
    <li>Start/end times MUST be in 24h-format (0:00-23:59)</li>
    <li>
      Rows with identical description (after cleanup, case-sensitivity is
      implied) are summed together
    </li>
    <li>
      Rows with "lounas" or "lunch" as their description are left out from the
      final hour total (a separate lunchless subtotal is calculated)
    </li>
    <li>
      The time ranges of consecutive lines are excepted to be "continuous", eg.
      8:00-9:00, 9:00-12:00
    </li>
    <li>
      The tool WILL attempt to fix overlaps/gaps between multiple lines and this
      WILL be visible in the output whenever this happens
    </li>
    <li>
      MUST, MAY etc. are defined as in <a
        href="https://datatracker.ietf.org/doc/html/rfc2119">rfc2119</a
      > and are non-negotiable.
    </li>
  </ul>
</div>

<style>
  ul {
    list-style-position: inside;
  }
  ol {
    list-style-position: inside;
  }
</style>
